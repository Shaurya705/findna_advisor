import os
import pytesseract
import cv2
import numpy as np
from PIL import Image
import re
from typing import Dict, Any, Optional, Tuple, List
import json
import logging
try:
    import easyocr  # Optional; depends on torch
except Exception:
    easyocr = None
try:
    import fitz  # type: ignore  # PyMuPDF for PDF rasterization (optional)
except Exception:
    fitz = None  # type: ignore
from datetime import datetime
import requests
from io import BytesIO
import base64

logger = logging.getLogger(__name__)

class AdvancedOCRService:
    """Advanced OCR service for invoice processing with multiple engines and AI enhancement"""
    
    def __init__(self):
        # Configure Tesseract on Windows if installed in standard path
        try:
            possible_paths = [
                r"C:\\Program Files\\Tesseract-OCR\\tesseract.exe",
                r"C:\\Program Files (x86)\\Tesseract-OCR\\tesseract.exe"
            ]
            for p in possible_paths:
                if os.path.exists(p):
                    pytesseract.pytesseract.tesseract_cmd = p
                    break
        except Exception:
            pass

        # Initialize EasyOCR reader for better accuracy (if available)
        self.easyocr_reader = None
        if easyocr is not None:
            try:
                self.easyocr_reader = easyocr.Reader(['en', 'hi'], gpu=False)
            except Exception as e:
                logger.warning(f"EasyOCR initialization failed (will use Tesseract only): {e}")
                self.easyocr_reader = None
        
        # Enhanced regex patterns for Indian invoices
        self.gst_pattern = r'\b\d{2}[A-Z]{5}\d{4}[A-Z]\d[Z]\d\b'
        self.pan_pattern = r'\b[A-Z]{5}\d{4}[A-Z]\b'
        
        # Comprehensive invoice patterns
        self.invoice_patterns = {
            'invoice_number': r'(?:invoice|bill|receipt|voucher)\s*(?:no|number|#)?\s*:?\s*([A-Z0-9\-/]+)',
            'purchase_order': r'(?:po|purchase\s*order)\s*(?:no|number|#)?\s*:?\s*([A-Z0-9\-/]+)',
            'date': r'(?:date|dated|dt)\s*:?\s*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})',
            'due_date': r'(?:due\s*date|payment\s*due)\s*:?\s*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})',
            'vendor_name': r'^([A-Z][A-Z\s&\.Ltd]+)(?:\n|$)',
            'vendor_address': r'([A-Z][A-Za-z\s,\-\.0-9]+(?:Road|Street|Lane|Avenue|Nagar|Colony|Area|City))',
            'phone': r'(\+?91[\s\-]?\d{10}|\d{10})',
            'email': r'([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})',
            'website': r'(www\.[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|https?://[a-zA-Z0-9.-]+)',
            'subtotal': r'(?:sub\s*total|subtotal)\s*:?\s*(?:rs\.?|₹)?\s*(\d+(?:,\d{3})*(?:\.\d{2})?)',
            'tax_amount': r'(?:gst|tax|vat)\s*(?:amount)?\s*:?\s*(?:rs\.?|₹)?\s*(\d+(?:,\d{3})*(?:\.\d{2})?)',
            'total_amount': r'(?:total|grand\s*total|amount|final\s*amount)\s*:?\s*(?:rs\.?|₹)?\s*(\d+(?:,\d{3})*(?:\.\d{2})?)',
            'igst': r'(?:igst)\s*(?:@)?\s*(\d+(?:\.\d+)?%?).*?(?:rs\.?|₹)?\s*(\d+(?:,\d{3})*(?:\.\d{2})?)',
            'cgst': r'(?:cgst)\s*(?:@)?\s*(\d+(?:\.\d+)?%?).*?(?:rs\.?|₹)?\s*(\d+(?:,\d{3})*(?:\.\d{2})?)',
            'sgst': r'(?:sgst)\s*(?:@)?\s*(\d+(?:\.\d+)?%?).*?(?:rs\.?|₹)?\s*(\d+(?:,\d{3})*(?:\.\d{2})?)',
            'tcs': r'(?:tcs)\s*(?:@)?\s*(\d+(?:\.\d+)?%?).*?(?:rs\.?|₹)?\s*(\d+(?:,\d{3})*(?:\.\d{2})?)',
            'tds': r'(?:tds)\s*(?:@)?\s*(\d+(?:\.\d+)?%?).*?(?:rs\.?|₹)?\s*(\d+(?:,\d{3})*(?:\.\d{2})?)'
        }
        
        # Enhanced line item patterns
        self.line_item_patterns = {
            'hsn_code': r'\b\d{4,8}\b',
            'quantity': r'(?:qty|quantity)\s*:?\s*(\d+(?:\.\d+)?)',
            'rate': r'(?:rate|price|unit\s*price)\s*:?\s*(?:rs\.?|₹)?\s*(\d+(?:,\d{3})*(?:\.\d{2})?)',
            'discount': r'(?:discount|disc)\s*:?\s*(\d+(?:\.\d+)?%?)',
            'unit': r'(?:unit|uom|nos|pcs|kg|gm|ltr|mtr)'
        }

    def _ensure_raster_image(self, file_path: str) -> Tuple[str, Optional[str]]:
        """Ensure we have a raster image path. If input is PDF, rasterize first page.
        Returns (image_path, temp_path_to_cleanup_or_None).
        """
        try:
            if file_path.lower().endswith('.pdf'):
                if fitz is None:
                    raise RuntimeError('PDF provided but PyMuPDF is not installed')
                doc = fitz.open(file_path)
                if doc.page_count == 0:
                    raise RuntimeError('Empty PDF')
                page = doc.load_page(0)
                zoom = 2.0
                mat = fitz.Matrix(zoom, zoom)
                pix = page.get_pixmap(matrix=mat, alpha=False)
                import tempfile
                temp_path = tempfile.mkstemp(suffix='.png')[1]
                pix.save(temp_path)
                doc.close()
                return temp_path, temp_path
            return file_path, None
        except Exception as e:
            logger.warning(f"Failed to rasterize PDF, falling back: {e}")
            return file_path, None
    
    def preprocess_image_advanced(self, image_path: str) -> List[np.ndarray]:
        """Advanced image preprocessing with multiple techniques"""
        try:
            # Read image
            img = cv2.imread(image_path)
            if img is None:
                raise ValueError(f"Could not read image from {image_path}")
            
            # Original image for comparison
            original = img.copy()
            
            # Convert to grayscale
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            
            # Multiple preprocessing approaches
            processed_images = []
            
            # Approach 1: Standard preprocessing
            denoised = cv2.medianBlur(gray, 3)
            thresh1 = cv2.adaptiveThreshold(
                denoised, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
            )
            kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (2, 2))
            cleaned1 = cv2.morphologyEx(thresh1, cv2.MORPH_CLOSE, kernel)
            processed_images.append(cleaned1)
            
            # Approach 2: Enhanced contrast
            clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
            enhanced = clahe.apply(gray)
            thresh2 = cv2.threshold(enhanced, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]
            processed_images.append(thresh2)
            
            # Approach 3: Gaussian blur + threshold
            blurred = cv2.GaussianBlur(gray, (5, 5), 0)
            thresh3 = cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]
            processed_images.append(thresh3)
            
            # Approach 4: Morphological operations
            kernel_morph = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))
            morph = cv2.morphologyEx(gray, cv2.MORPH_CLOSE, kernel_morph)
            thresh4 = cv2.adaptiveThreshold(
                morph, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY, 15, 10
            )
            processed_images.append(thresh4)
            
            # Approach 5: Deskewing
            coords = np.column_stack(np.where(thresh1 > 0))
            if len(coords) > 100:
                angle = cv2.minAreaRect(coords)[-1]
                if angle < -45:
                    angle = -(90 + angle)
                else:
                    angle = -angle
                (h, w) = gray.shape[:2]
                center = (w // 2, h // 2)
                M = cv2.getRotationMatrix2D(center, angle, 1.0)
                rotated = cv2.warpAffine(gray, M, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
                thresh5 = cv2.threshold(rotated, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]
                processed_images.append(thresh5)
            
            return processed_images
            
        except Exception as e:
            logger.error(f"Error in advanced preprocessing: {e}")
            # Return a very basic grayscale image as fallback without relying on img variable
            try:
                raw = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
                if raw is None:
                    raise ValueError("Fallback read failed")
                thresh = cv2.threshold(raw, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]
                return [thresh]
            except Exception:
                # Create a tiny empty image to avoid total failure downstream
                blank = np.full((10, 10), 255, dtype=np.uint8)
                return [blank]
    
    def extract_text_multi_engine(self, image_path: str) -> Dict[str, Any]:
        """Extract text using multiple OCR engines and combine results"""
        try:
            # If PDF, rasterize first page to image
            raster_path, tmp = self._ensure_raster_image(image_path)
            # Get preprocessed images
            processed_images = self.preprocess_image_advanced(raster_path)
            
            all_results = []
            
            # Try each preprocessed image with Tesseract
            for i, img in enumerate(processed_images):
                # Tesseract configuration optimized for invoices
                config = r'--oem 3 --psm 6 -c tessedit_char_whitelist=0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.,/-:₹@%#'
                
                # Extract text with confidence
                data = pytesseract.image_to_data(img, config=config, output_type=pytesseract.Output.DICT)
                
                # Calculate confidence
                confidences = [int(conf) for conf in data['conf'] if int(conf) > 0]
                avg_confidence = sum(confidences) / len(confidences) if confidences else 0
                
                # Extract text
                text = pytesseract.image_to_string(img, config=config)
                
                all_results.append({
                    'engine': f'tesseract_v{i+1}',
                    'text': text.strip(),
                    'confidence': avg_confidence / 100,
                    'word_count': len(text.split()),
                    'char_count': len(text)
                })
            
            # Try EasyOCR on original image if available
            if self.easyocr_reader is not None:
                try:
                    easy_results = self.easyocr_reader.readtext(image_path)
                    easy_text = '\n'.join([r[1] for r in easy_results]) if easy_results else ''
                    easy_conf = sum([r[2] for r in easy_results]) / len(easy_results) if easy_results else 0
                    all_results.append({
                        'engine': 'easyocr',
                        'text': easy_text,
                        'confidence': float(easy_conf),
                        'word_count': len(easy_text.split()),
                        'char_count': len(easy_text)
                    })
                except Exception as e:
                    logger.warning(f"EasyOCR failed: {e}")
            
            # Select best result based on confidence and text length
            best_result = max(all_results, key=lambda x: (x['confidence'] * 0.7 + (x['word_count'] / 100) * 0.3))
            
            result = {
                'best_text': best_result['text'],
                'best_confidence': best_result['confidence'],
                'best_engine': best_result['engine'],
                'all_results': all_results,
                'total_engines': len(all_results)
            }
            # Cleanup temporary raster file
            if tmp and os.path.exists(tmp):
                try:
                    os.remove(tmp)
                except Exception:
                    pass
            return result
            
        except Exception as e:
            logger.error(f"Error in multi-engine text extraction: {e}")
        # Fallback to single engine
            try:
                raster_path, tmp = self._ensure_raster_image(image_path)
                img = cv2.imread(raster_path)
                gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
                text = pytesseract.image_to_string(gray)
                result = {
                    'best_text': text,
            'best_confidence': 0.5 if text.strip() else 0.2,
                    'best_engine': 'tesseract_fallback',
                    'all_results': [],
                    'total_engines': 1
                }
                if tmp and os.path.exists(tmp):
                    try:
                        os.remove(tmp)
                    except Exception:
                        pass
                return result
            except:
                return {
                    'best_text': '',
            'best_confidence': 0.1,
                    'best_engine': 'none',
                    'all_results': [],
                    'total_engines': 0
                }
    
    def extract_invoice_data_advanced(self, text: str) -> Dict[str, Any]:
        """Extract comprehensive structured data from OCR text"""
        extracted_data = {}
        
        try:
            # Clean and normalize text
            cleaned_text = self._clean_text(text)
            
            # Extract basic information
            for field, pattern in self.invoice_patterns.items():
                matches = re.search(pattern, cleaned_text, re.IGNORECASE | re.MULTILINE)
                if matches:
                    if field in ['igst', 'cgst', 'sgst', 'tcs', 'tds']:
                        # For tax fields, extract both rate and amount
                        if len(matches.groups()) >= 2:
                            extracted_data[f'{field}_rate'] = matches.group(1)
                            extracted_data[f'{field}_amount'] = self._parse_amount(matches.group(2))
                    else:
                        extracted_data[field] = matches.group(1).strip()
            
            # Extract GST and PAN numbers
            gst_matches = re.findall(self.gst_pattern, cleaned_text)
            if gst_matches:
                extracted_data['gstin'] = gst_matches[0]
                # Try to extract multiple GST numbers (buyer/seller)
                if len(gst_matches) > 1:
                    extracted_data['buyer_gstin'] = gst_matches[0]
                    extracted_data['seller_gstin'] = gst_matches[1]
            
            pan_matches = re.findall(self.pan_pattern, cleaned_text)
            if pan_matches:
                extracted_data['pan'] = pan_matches[0]
            
            # Extract comprehensive line items
            line_items = self._extract_line_items_advanced(cleaned_text)
            if line_items:
                extracted_data['line_items'] = line_items
                extracted_data['total_items'] = len(line_items)
            
            # Post-process and validate amounts
            amount_fields = ['subtotal', 'tax_amount', 'total_amount', 'igst_amount', 'cgst_amount', 'sgst_amount', 'tcs_amount', 'tds_amount']
            for field in amount_fields:
                if field in extracted_data:
                    extracted_data[field] = self._parse_amount(extracted_data[field])
            
            # Parse and validate dates
            date_fields = ['date', 'due_date']
            for field in date_fields:
                if field in extracted_data:
                    extracted_data[field] = self._parse_date(extracted_data[field])
            
            # Calculate summary statistics
            extracted_data['extraction_summary'] = self._calculate_extraction_summary(extracted_data)
            
            # Validate data consistency
            extracted_data['validation_results'] = self._validate_invoice_data(extracted_data)
            
            return extracted_data
            
        except Exception as e:
            logger.error(f"Error extracting advanced invoice data: {e}")
            return {}
    
    def _clean_text(self, text: str) -> str:
        """Clean and normalize OCR text"""
        # Remove excessive whitespace
        cleaned = re.sub(r'\n+', '\n', text)
        cleaned = re.sub(r'\s+', ' ', cleaned)
        
        # Fix common OCR errors
        replacements = {
            'G5T': 'GST',
            'lGST': 'IGST',
            'CG5T': 'CGST',
            'SG5T': 'SGST',
            'AMT': 'AMOUNT',
            'QTY': 'QUANTITY',
            'TOTL': 'TOTAL',
            '₹ ': '₹',
            'Rs ': '₹'
        }
        
        for old, new in replacements.items():
            cleaned = cleaned.replace(old, new)
        
        return cleaned
    
    def _parse_amount(self, amount_str: str) -> Optional[float]:
        """Parse amount string to float"""
        if not amount_str:
            return None
        
        try:
            # Remove currency symbols and commas
            cleaned = re.sub(r'[₹Rs.,]', '', amount_str).strip()
            return float(cleaned)
        except (ValueError, AttributeError):
            return None
    
    def _parse_date(self, date_str: str) -> Optional[str]:
        """Parse date string to standardized format"""
        if not date_str:
            return None
        
        try:
            # Try different date formats
            formats = ['%d/%m/%Y', '%d-%m-%Y', '%d.%m.%Y', '%d/%m/%y', '%d-%m-%y']
            
            for fmt in formats:
                try:
                    parsed_date = datetime.strptime(date_str, fmt)
                    return parsed_date.strftime('%Y-%m-%d')
                except ValueError:
                    continue
            
            return date_str  # Return original if parsing fails
        except Exception:
            return None
    
    def _extract_line_items_advanced(self, text: str) -> List[Dict[str, Any]]:
        """Extract detailed line items from invoice text"""
        line_items = []
        
        try:
            lines = text.split('\n')
            current_item = {}
            
            for i, line in enumerate(lines):
                line = line.strip()
                if not line:
                    continue
                
                # Look for item description (usually longer text without numbers at start)
                if re.match(r'^[A-Za-z][A-Za-z\s]+', line) and not re.search(r'^\d', line):
                    if current_item and 'description' in current_item:
                        line_items.append(current_item)
                    
                    current_item = {'description': line}
                    
                    # Look ahead for quantity, rate, amount in next few lines
                    for j in range(i+1, min(i+4, len(lines))):
                        next_line = lines[j].strip()
                        
                        # Extract HSN code
                        hsn_match = re.search(self.line_item_patterns['hsn_code'], next_line)
                        if hsn_match and 'hsn_code' not in current_item:
                            current_item['hsn_code'] = hsn_match.group(0)
                        
                        # Extract quantity
                        qty_match = re.search(self.line_item_patterns['quantity'], next_line, re.IGNORECASE)
                        if qty_match:
                            current_item['quantity'] = float(qty_match.group(1))
                        
                        # Extract rate
                        rate_match = re.search(self.line_item_patterns['rate'], next_line, re.IGNORECASE)
                        if rate_match:
                            current_item['rate'] = self._parse_amount(rate_match.group(1))
                        
                        # Extract discount
                        disc_match = re.search(self.line_item_patterns['discount'], next_line, re.IGNORECASE)
                        if disc_match:
                            current_item['discount'] = disc_match.group(1)
                        
                        # Extract line total (amount at end of line)
                        amount_match = re.search(r'(\d+(?:,\d{3})*(?:\.\d{2})?)\s*$', next_line)
                        if amount_match and 'amount' not in current_item:
                            current_item['amount'] = self._parse_amount(amount_match.group(1))
                
                # Alternative pattern: Look for lines with clear amount patterns
                elif re.search(r'(\d+(?:,\d{3})*(?:\.\d{2})?)\s*$', line):
                    amount = self._parse_amount(re.search(r'(\d+(?:,\d{3})*(?:\.\d{2})?)\s*$', line).group(1))
                    if amount and amount > 0:
                        # Extract description (everything before the amount)
                        desc_match = re.match(r'^(.+?)\s+\d+(?:,\d{3})*(?:\.\d{2})?\s*$', line)
                        if desc_match:
                            description = desc_match.group(1).strip()
                            
                            line_item = {
                                'description': description,
                                'amount': amount,
                                'quantity': 1,  # Default
                                'rate': amount  # Assume rate = amount if quantity = 1
                            }
                            
                            # Try to extract quantity from description
                            qty_in_desc = re.search(r'(\d+(?:\.\d+)?)\s*(?:nos|pcs|qty|units?)', description, re.IGNORECASE)
                            if qty_in_desc:
                                qty = float(qty_in_desc.group(1))
                                line_item['quantity'] = qty
                                line_item['rate'] = amount / qty if qty > 0 else amount
                            
                            line_items.append(line_item)
            
            # Add last item if exists
            if current_item and 'description' in current_item:
                line_items.append(current_item)
            
            # Clean up and validate line items
            validated_items = []
            for item in line_items:
                if 'description' in item and len(item['description']) > 3:
                    # Set defaults for missing fields
                    item.setdefault('quantity', 1)
                    item.setdefault('rate', item.get('amount', 0))
                    item.setdefault('amount', item.get('rate', 0) * item.get('quantity', 1))
                    
                    # Validate amounts
                    if item.get('amount', 0) > 0:
                        validated_items.append(item)
            
            return validated_items[:15]  # Limit to first 15 items
            
        except Exception as e:
            logger.error(f"Error extracting advanced line items: {e}")
            return []
    
    def _calculate_extraction_summary(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate summary of extraction results"""
        summary = {
            'fields_extracted': len([k for k, v in data.items() if v and k != 'extraction_summary']),
            'has_vendor_info': bool(data.get('vendor_name') or data.get('phone') or data.get('email')),
            'has_amounts': bool(data.get('total_amount') or data.get('subtotal')),
            'has_tax_info': bool(data.get('gstin') or data.get('igst_amount') or data.get('cgst_amount')),
            'has_line_items': bool(data.get('line_items')),
            'line_items_count': len(data.get('line_items', [])),
            'confidence_level': 'high' if len([k for k, v in data.items() if v]) > 8 else 'medium' if len([k for k, v in data.items() if v]) > 4 else 'low'
        }
        return summary
    
    def _validate_invoice_data(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Validate extracted invoice data for consistency"""
        validation = {
            'is_valid_invoice': True,
            'errors': [],
            'warnings': []
        }
        
        # Check for required fields
        required_fields = ['vendor_name', 'total_amount', 'date']
        for field in required_fields:
            if not data.get(field):
                validation['errors'].append(f"Missing required field: {field}")
                validation['is_valid_invoice'] = False
        
        # Validate GST format
        if data.get('gstin') and not re.match(self.gst_pattern, data['gstin']):
            validation['errors'].append("Invalid GST format")
        
        # Validate amount consistency
        subtotal = data.get('subtotal', 0) or 0
        total = data.get('total_amount', 0) or 0
        tax_amount = data.get('tax_amount', 0) or 0
        
        if subtotal and total and tax_amount:
            calculated_total = subtotal + tax_amount
            if abs(calculated_total - total) > 1:  # Allow small rounding differences
                validation['warnings'].append(f"Amount mismatch: Subtotal + Tax ({calculated_total}) ≠ Total ({total})")
        
        # Validate line items total
        if data.get('line_items'):
            line_items_total = sum(item.get('amount', 0) for item in data['line_items'])
            if subtotal and abs(line_items_total - subtotal) > 1:
                validation['warnings'].append(f"Line items total ({line_items_total}) doesn't match subtotal ({subtotal})")
        
        return validation
    
    def validate_gst_number(self, gstin: str) -> Dict[str, Any]:
        """Validate GST number format and get details"""
        validation_result = {
            'is_valid': False,
            'state_code': None,
            'entity_type': None,
            'check_digit': None
        }
        
        if not gstin or len(gstin) != 15:
            return validation_result
        
        # Check format
        if not re.match(self.gst_pattern, gstin):
            return validation_result
        
        try:
            # Extract components
            state_code = gstin[:2]
            pan = gstin[2:12]
            entity_code = gstin[12]
            check_digit = gstin[14]
            
            validation_result.update({
                'is_valid': True,
                'state_code': state_code,
                'pan': pan,
                'entity_type': self._get_entity_type(entity_code),
                'check_digit': check_digit
            })
            
        except Exception as e:
            logger.error(f"Error validating GST number: {e}")
        
        return validation_result
    
    def _get_entity_type(self, code: str) -> str:
        """Get entity type from GST entity code"""
        entity_types = {
            '1': 'Company',
            '2': 'Society',
            '3': 'Public Limited Company', 
            '4': 'Partnership Firm',
            '5': 'LLP',
            '6': 'Government',
            '7': 'Trust',
            '8': 'HUF',
            '9': 'Individual',
            'A': 'Association of Persons',
            'B': 'Body of Individuals',
            'C': 'Company',
            'F': 'Firm',
            'G': 'Government',
            'H': 'HUF',
            'L': 'LLP',
            'P': 'Individual',
            'T': 'Trust'
        }
        return entity_types.get(code, 'Unknown')
    
    async def process_invoice_advanced(self, file_path: str) -> Dict[str, Any]:
        """Complete advanced invoice processing pipeline"""
        try:
            # Extract text using multiple engines
            ocr_results = self.extract_text_multi_engine(file_path)
            
            # Extract structured data using advanced patterns
            invoice_data = self.extract_invoice_data_advanced(ocr_results['best_text'])
            
            # Validate GST if present
            gst_details = None
            if invoice_data.get('gstin'):
                gst_details = self.validate_gst_number(invoice_data['gstin'])
            
            # Calculate confidence score based on multiple factors
            overall_confidence = self._calculate_overall_confidence(ocr_results, invoice_data)
            # Guarantee a small floor to avoid 0% UI if any text is present
            if overall_confidence == 0 and (ocr_results.get('best_text') or '').strip():
                overall_confidence = max(0.15, ocr_results.get('best_confidence', 0.1))
            
            # Generate processing report
            processing_report = self._generate_processing_report(ocr_results, invoice_data)
            
            result = {
                'ocr_results': {
                    'text': ocr_results['best_text'],
                    'confidence': ocr_results['best_confidence'],
                    'engine_used': ocr_results['best_engine'],
                    'engines_tried': ocr_results['total_engines'],
                    'all_results': ocr_results['all_results']
                },
                'invoice_data': invoice_data,
                'gst_details': gst_details,
                'overall_confidence': overall_confidence,
                'processing_report': processing_report,
                'processing_status': 'success',
                'timestamp': datetime.now().isoformat()
            }
            
            return result
            
        except Exception as e:
            logger.error(f"Error in advanced invoice processing: {e}")
            return {
                'ocr_results': {
                    'text': '',
                    'confidence': 0.0,
                    'engine_used': 'none',
                    'engines_tried': 0,
                    'all_results': []
                },
                'invoice_data': {},
                'gst_details': None,
                'overall_confidence': 0.1,
                'processing_report': {'errors': [str(e)]},
                'processing_status': 'failed',
                'timestamp': datetime.now().isoformat(),
                'error': str(e)
            }
    
    def _calculate_overall_confidence(self, ocr_results: Dict, invoice_data: Dict) -> float:
        """Calculate overall confidence score"""
        ocr_confidence = ocr_results.get('best_confidence', 0)
        
        # Data completeness factor
        total_fields = len(self.invoice_patterns)
        extracted_fields = len([k for k, v in invoice_data.items() if v and k not in ['extraction_summary', 'validation_results']])
        completeness_score = extracted_fields / total_fields
        
        # Validation factor
        validation_results = invoice_data.get('validation_results', {})
        validation_score = 1.0 if validation_results.get('is_valid_invoice', False) else 0.5
        
        # Line items factor
        line_items_score = 0.8 if invoice_data.get('line_items') else 0.3
        
        # Combine all factors
        overall_confidence = (
            ocr_confidence * 0.4 +
            completeness_score * 0.3 +
            validation_score * 0.2 +
            line_items_score * 0.1
        )
        
        return min(1.0, overall_confidence)
    
    def _generate_processing_report(self, ocr_results: Dict, invoice_data: Dict) -> Dict[str, Any]:
        """Generate detailed processing report"""
        report = {
            'ocr_summary': {
                'engines_used': ocr_results.get('total_engines', 0),
                'best_engine': ocr_results.get('best_engine', 'unknown'),
                'text_length': len(ocr_results.get('best_text', '')),
                'confidence': ocr_results.get('best_confidence', 0)
            },
            'extraction_summary': invoice_data.get('extraction_summary', {}),
            'validation_summary': invoice_data.get('validation_results', {}),
            'recommendations': self._generate_recommendations(invoice_data),
            'processing_time': datetime.now().isoformat()
        }
        
        return report
    
    def _generate_recommendations(self, invoice_data: Dict) -> List[str]:
        """Generate recommendations for improving data quality"""
        recommendations = []
        
        if not invoice_data.get('vendor_name'):
            recommendations.append("Consider scanning a clearer image to extract vendor information")
        
        if not invoice_data.get('gstin'):
            recommendations.append("GST number not found - ensure the invoice contains visible GST information")
        
        if not invoice_data.get('line_items'):
            recommendations.append("Line items not detected - try scanning with better lighting")
        
        validation = invoice_data.get('validation_results', {})
        if validation.get('warnings'):
            recommendations.extend([f"Data validation: {warning}" for warning in validation['warnings']])
        
        if invoice_data.get('extraction_summary', {}).get('confidence_level') == 'low':
            recommendations.append("Low extraction confidence - consider rescanning with higher resolution")
        
        return recommendations
