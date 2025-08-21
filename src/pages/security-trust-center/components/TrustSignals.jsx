import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const TrustSignals = () => {
  const [selectedTestimonial, setSelectedTestimonial] = useState(0);

  const partnerships = [
    {
      name: "State Bank of India",
      type: "Banking Partner",
      logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=60&fit=crop",
      description: "Secure banking integration for seamless transactions",
      status: "Active Partnership"
    },
    {
      name: "HDFC Securities",
      type: "Investment Partner",
      logo: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=100&h=60&fit=crop",
      description: "Direct market access and investment execution",
      status: "Certified Integration"
    },
    {
      name: "ICICI Prudential",
      type: "Insurance Partner",
      logo: "https://images.unsplash.com/photo-1560472355-536de3962603?w=100&h=60&fit=crop",
      description: "Comprehensive insurance and protection solutions",
      status: "Authorized Distributor"
    },
    {
      name: "Zerodha",
      type: "Trading Platform",
      logo: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=100&h=60&fit=crop",
      description: "Low-cost trading and investment platform integration",
      status: "API Partnership"
    }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      location: "Mumbai, Maharashtra",
      profession: "Software Engineer",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg",
      rating: 5,
      text: `FinDNA Advisor ने मेरी financial planning को बिल्कुल बदल दिया है। AI advisor हिंदी में समझाता है और recommendations बहुत accurate हैं। Tax optimization से मैंने इस साल ₹45,000 बचाए हैं।`,
      achievement: "Saved ₹45,000 in taxes",
      timeUsing: "8 months"
    },
    {
      name: "Rajesh Kumar",
      location: "Delhi, NCR",
      profession: "Business Owner",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
      rating: 5,
      text: "The portfolio intelligence center helped me diversify my investments properly. The AI recommendations are backed by solid research and the security features give me complete confidence in the platform.",
      achievement: "25% portfolio growth",
      timeUsing: "1.2 years"
    },
    {
      name: "Anita Patel",
      location: "Ahmedabad, Gujarat",
      profession: "Doctor",
      avatar: "https://randomuser.me/api/portraits/women/28.jpg",
      rating: 5,
      text: "Being a busy professional, I needed something that could handle my investments automatically. The retirement planning lab showed me exactly how much I need to save for my goals. Very impressed!",
      achievement: "Retirement goal on track",
      timeUsing: "6 months"
    }
  ];

  const certifications = [
    {
      name: "ISO 27001:2022",
      issuer: "International Organization for Standardization",
      icon: "Award",
      color: "text-primary"
    },
    {
      name: "SOC 2 Type II",
      issuer: "American Institute of CPAs",
      icon: "Shield",
      color: "text-success"
    },
    {
      name: "PCI DSS Compliant",
      issuer: "Payment Card Industry Security Standards Council",
      icon: "CreditCard",
      color: "text-prosperity"
    },
    {
      name: "SEBI Registered",
      issuer: "Securities and Exchange Board of India",
      icon: "FileCheck",
      color: "text-trust"
    }
  ];

  const stats = [
    { label: "Active Users", value: "2.5M+", icon: "Users" },
    { label: "Assets Managed", value: "₹12,500 Cr", icon: "TrendingUp" },
    { label: "Tax Saved", value: "₹850 Cr", icon: "Calculator" },
    { label: "Security Incidents", value: "0", icon: "Shield" }
  ];

  return (
    <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-success to-prosperity rounded-lg flex items-center justify-center">
          <Icon name="Heart" size={20} color="white" strokeWidth={2.5} />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-text-primary">Trust & Recognition</h2>
          <p className="text-sm text-text-secondary">Partnerships, certifications, and user testimonials</p>
        </div>
      </div>
      {/* Trust Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats?.map((stat, index) => (
          <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Icon name={stat?.icon} size={16} className="text-primary" />
            </div>
            <div className="text-lg font-bold text-text-primary">{stat?.value}</div>
            <div className="text-xs text-text-secondary">{stat?.label}</div>
          </div>
        ))}
      </div>
      {/* Partnerships */}
      <div className="mb-8">
        <h3 className="font-medium text-text-primary mb-4">Trusted Partnerships</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {partnerships?.map((partner, index) => (
            <div key={index} className="p-4 border border-border rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-8 bg-gray-100 rounded overflow-hidden">
                  <Image
                    src={partner?.logo}
                    alt={partner?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-medium text-text-primary">{partner?.name}</h4>
                  <p className="text-xs text-text-secondary">{partner?.type}</p>
                </div>
              </div>
              <p className="text-sm text-text-secondary mb-2">{partner?.description}</p>
              <div className="flex items-center space-x-2">
                <Icon name="CheckCircle" size={14} className="text-success" />
                <span className="text-xs font-medium text-success">{partner?.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Certifications */}
      <div className="mb-8">
        <h3 className="font-medium text-text-primary mb-4">Security Certifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {certifications?.map((cert, index) => (
            <div key={index} className="text-center p-4 border border-border rounded-lg hover:shadow-md transition-shadow">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-3 ${cert?.color === 'text-primary' ? 'bg-primary/10' : cert?.color === 'text-success' ? 'bg-success/10' : cert?.color === 'text-prosperity' ? 'bg-prosperity/10' : 'bg-trust/10'}`}>
                <Icon name={cert?.icon} size={20} className={cert?.color} />
              </div>
              <h4 className="font-medium text-text-primary text-sm mb-1">{cert?.name}</h4>
              <p className="text-xs text-text-secondary">{cert?.issuer}</p>
            </div>
          ))}
        </div>
      </div>
      {/* User Testimonials */}
      <div>
        <h3 className="font-medium text-text-primary mb-4">User Testimonials</h3>
        
        <div className="flex space-x-2 mb-4">
          {testimonials?.map((_, index) => (
            <Button
              key={index}
              variant={selectedTestimonial === index ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTestimonial(index)}
              className="w-8 h-8 p-0"
            >
              {index + 1}
            </Button>
          ))}
        </div>

        <div className="border border-border rounded-lg p-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src={testimonials?.[selectedTestimonial]?.avatar}
                alt={testimonials?.[selectedTestimonial]?.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h4 className="font-medium text-text-primary">{testimonials?.[selectedTestimonial]?.name}</h4>
                <div className="flex space-x-1">
                  {[...Array(testimonials?.[selectedTestimonial]?.rating)]?.map((_, i) => (
                    <Icon key={i} name="Star" size={14} className="text-prosperity fill-current" />
                  ))}
                </div>
              </div>
              
              <div className="flex items-center space-x-4 text-xs text-text-secondary mb-3">
                <span>{testimonials?.[selectedTestimonial]?.location}</span>
                <span>•</span>
                <span>{testimonials?.[selectedTestimonial]?.profession}</span>
                <span>•</span>
                <span>Using for {testimonials?.[selectedTestimonial]?.timeUsing}</span>
              </div>
              
              <p className="text-sm text-text-secondary mb-3 leading-relaxed">
                {testimonials?.[selectedTestimonial]?.text}
              </p>
              
              <div className="flex items-center space-x-2">
                <Icon name="TrendingUp" size={14} className="text-success" />
                <span className="text-sm font-medium text-success">
                  {testimonials?.[selectedTestimonial]?.achievement}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 p-4 bg-gradient-cultural rounded-lg text-white">
        <div className="flex items-center space-x-3">
          <Icon name="Users" size={20} color="white" />
          <div>
            <h4 className="font-medium mb-1">Join 2.5M+ Satisfied Users</h4>
            <p className="text-sm opacity-90">
              Experience the trust and security that millions of Indians rely on for their financial future
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustSignals;