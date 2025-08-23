import React, { useEffect, useRef, useState } from 'react';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import ChatHeader from './components/ChatHeader';
import ConversationHistory from './components/ConversationHistory';
import ChatInput from './components/ChatInput';
import QuickActionButtons from './components/QuickActionButtons';
import AIInsightPanel from './components/AIInsightPanel';
import { useAIChat } from '../../hooks/useAIChat';
import { useAuth } from '../../contexts/AuthContext';

const AIAdvisorChatInterface = () => {
	const { isAuthenticated } = useAuth();
	const {
		messages,
		isTyping,
		loading,
		error,
		clearError,
		sendMessage,
		handleQuickAction,
	} = useAIChat();

	const [currentLanguage, setCurrentLanguage] = useState('en');
	const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
		const [showInsightPanel, setShowInsightPanel] = useState(() => (typeof window !== 'undefined' ? window.innerWidth >= 1280 : true));
		const [quickActionsVisible, setQuickActionsVisible] = useState(false); // default collapsed for more chat height
		const [quickActionsDock, setQuickActionsDock] = useState('bottom'); // 'top' | 'bottom'

	// Speech features
	const [isListening, setIsListening] = useState(false);
	const [enableTTS, setEnableTTS] = useState(false);
	const recognitionRef = useRef(null);
	const pendingTranscriptRef = useRef('');
	const [liveTranscript, setLiveTranscript] = useState('');

	// Online/offline status
	useEffect(() => {
		const on = () => setIsOnline(true);
		const off = () => setIsOnline(false);
		window.addEventListener('online', on);
		window.addEventListener('offline', off);
		return () => {
			window.removeEventListener('online', on);
			window.removeEventListener('offline', off);
		};
	}, []);

	// Responsive insight panel behavior
	useEffect(() => {
		const handleResize = () => setShowInsightPanel(window.innerWidth >= 1280);
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	const onLanguageChange = (lang) => setCurrentLanguage(lang);
	const onToggleInsightPanel = () => setShowInsightPanel((v) => !v);
		const toggleQuickActions = () => setQuickActionsVisible((v) => !v);
		const toggleQuickDock = () => setQuickActionsDock((d) => (d === 'top' ? 'bottom' : 'top'));

	// Text-to-Speech for latest AI message with improved voice quality
	useEffect(() => {
		if (!enableTTS || !('speechSynthesis' in window)) return;
		if (!messages || messages.length === 0) return;
		const last = messages[messages.length - 1];
		if (last.sender === 'ai' && last.content) {
			try {
				// Cancel any ongoing speech
				window.speechSynthesis.cancel();
				
				// Create utterance
				const utter = new SpeechSynthesisUtterance(last.content);
				
				// Set language based on current selection
				utter.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-US';
				
				// Get available voices
				const voices = window.speechSynthesis.getVoices();
				
				// Try to find a high-quality voice
				let selectedVoice = null;
				
				// Preferred voice names by language
				const preferredVoices = {
					'en-US': ['Google US English', 'Microsoft David', 'Alex', 'Samantha'],
					'hi-IN': ['Google हिन्दी', 'Microsoft Hemant', 'Microsoft Kalpana']
				};
				
				// Try to find preferred voice
				if (voices && voices.length > 0) {
					const langKey = currentLanguage === 'hi' ? 'hi-IN' : 'en-US';
					for (const preferred of preferredVoices[langKey]) {
						const match = voices.find(v => v.name.includes(preferred));
						if (match) {
							selectedVoice = match;
							break;
						}
					}
					
					// Fallback to any voice in the right language
					if (!selectedVoice) {
						selectedVoice = voices.find(v => v.lang.includes(langKey));
					}
					
					// Set the selected voice
					if (selectedVoice) {
						utter.voice = selectedVoice;
					}
				}
				
				// Improve speech parameters
				utter.rate = 1.0;     // Normal speaking rate
				utter.pitch = 1.0;    // Normal pitch
				utter.volume = 1.0;   // Full volume
				
				// Add event handlers for better UX
				utter.onstart = () => {
					// Could add visual indicator that TTS is active
				};
				
				utter.onend = () => {
					// Could remove visual indicator
				};
				
				utter.onerror = (e) => {
					console.error('TTS error:', e);
				};
				
				// Speak the text
				window.speechSynthesis.speak(utter);
			} catch (e) { 
				console.error('TTS failed:', e);
			}
		}
	}, [messages, enableTTS, currentLanguage]);

	// Initialize / cleanup speech recognition
	useEffect(() => {
		return () => {
			if (recognitionRef.current) {
				try { recognitionRef.current.stop(); } catch (_) {}
			}
			if ('speechSynthesis' in window) {
				window.speechSynthesis.cancel();
			}
		};
	}, []);

	const handleVoiceInputToggle = (next) => {
		const shouldStart = typeof next === 'boolean' ? next : !isListening;
		if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
			// Browser not supported
			setIsListening(false);
			return;
		}
		if (shouldStart) {
			try {
				const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
				const recog = new SR();
				
				// Configure speech recognition
				recog.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-US';
				recog.interimResults = true;  // Get results as you speak
				recog.continuous = true;      // Don't stop after silence
				recog.maxAlternatives = 3;    // Get multiple alternatives for better accuracy
				
				// Clear any previous transcript
				pendingTranscriptRef.current = '';
				
				// Handle results as they come in
				recog.onresult = (e) => {
					// Collect all results
					let interimTranscript = '';
					let finalTranscript = '';
					
					for (let i = e.resultIndex; i < e.results.length; i++) {
						const transcript = e.results[i][0].transcript;
						if (e.results[i].isFinal) {
							finalTranscript += transcript;
						} else {
							interimTranscript += transcript;
						}
					}
					
					// Update the combined transcript
					const combinedTranscript = (pendingTranscriptRef.current + ' ' + finalTranscript).trim() + 
						(interimTranscript ? ' ' + interimTranscript : '');
					
					// Store final parts in the ref for persistence
					if (finalTranscript) {
						pendingTranscriptRef.current = (pendingTranscriptRef.current + ' ' + finalTranscript).trim();
					}
					
					// Update the live display
					setLiveTranscript(combinedTranscript);
				};
				
				// Handle end of recognition
				recog.onend = () => {
					setIsListening(false);
					const finalText = pendingTranscriptRef.current?.trim();
					if (finalText) {
						// Send the message
						onSendMessage(finalText);
						// Clear the transcript
						pendingTranscriptRef.current = '';
						setLiveTranscript('');
					}
				};
				
				// Handle errors
				recog.onerror = (event) => {
					console.error('Speech recognition error', event.error);
					setIsListening(false);
				};
				
				// Handle no-speech timeout
				recog.onnomatch = () => {
					setIsListening(false);
				};
				
				// Store the recognition instance and start it
				recognitionRef.current = recog;
				recog.start();
				setIsListening(true);
			} catch (error) {
				console.error('Failed to start speech recognition', error);
				setIsListening(false);
			}
		} else {
			// Stop recognition if it's active
			try { 
				if (recognitionRef.current) {
					recognitionRef.current.stop(); 
				}
			} catch (error) {
				console.error('Error stopping recognition', error);
			}
			setIsListening(false);
			setLiveTranscript('');
		}
	};

	const onSendMessage = (content) => {
		if (!content?.trim() || isTyping) return;
		sendMessage(content.trim());
	};

	// Normalize quick action from various components
	const onQuickAction = (action) => {
		const id = typeof action === 'string' ? action : action?.id;
		if (!id) return;
		handleQuickAction(id);
	};

	const onViewInsightDetails = (id) => {
		// For now, route insight clicks into contextual chat prompts
		onSendMessage(`Give me more details about ${id?.replace('_', ' ')}`);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
			{/* Global site header */}
			<Header />

			{/* Page content */}
			<main className="pt-16 flex flex-col h-[calc(100vh-0px)]">
				{/* Chat top bar */}
				<ChatHeader
					currentLanguage={currentLanguage}
					onLanguageChange={onLanguageChange}
					isOnline={isOnline}
					onToggleInsightPanel={onToggleInsightPanel}
					showInsightPanel={showInsightPanel}
				/>

				{/* Error banner */}
				{error && (
					<div className="px-4 sm:px-6 lg:px-8 mt-4">
						<div className="rounded-xl border border-red-200 bg-red-50 text-red-800 p-3 flex items-start justify-between shadow-sm">
							<div className="text-sm font-medium">{error}</div>
							<button onClick={clearError} className="text-xs font-semibold underline">Dismiss</button>
						</div>
					</div>
				)}

				{/* Main chat area */}
						<div className="flex-1 flex min-h-0">
					{/* Conversation/messages */}
							<section className="relative flex-1 min-w-0 bg-white/90 backdrop-blur-xl border-t border-gray-200">
								{/* Floating controls for Quick Actions */}
								<div className="pointer-events-none absolute right-4 bottom-28 z-10 flex flex-col gap-2">
									<button
										onClick={toggleQuickActions}
										className="pointer-events-auto p-3 rounded-xl bg-white/90 border border-gray-200 shadow-md hover:shadow-lg hover:bg-white transition"
										title={quickActionsVisible ? 'Hide quick actions' : 'Show quick actions'}
									>
										<Icon name={quickActionsVisible ? 'MinusSquare' : 'PlusSquare'} size={18} className="text-gray-700" />
									</button>
									<button
										onClick={toggleQuickDock}
										className="pointer-events-auto p-3 rounded-xl bg-white/90 border border-gray-200 shadow-md hover:shadow-lg hover:bg-white transition"
										title={`Dock quick actions ${quickActionsDock === 'top' ? 'bottom' : 'top'}`}
									>
										<Icon name={quickActionsDock === 'top' ? 'ArrowDownWideNarrow' : 'ArrowUpNarrowWide'} size={18} className="text-gray-700" />
									</button>
									{/* TTS toggle */}
									<button
										onClick={() => setEnableTTS((v) => !v)}
										className={`pointer-events-auto p-3 rounded-xl border shadow-md transition ${enableTTS ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white/90 text-gray-700 border-gray-200 hover:shadow-lg hover:bg-white'}`}
										title={enableTTS ? 'Disable voice playback' : 'Enable voice playback'}
									>
										<Icon name="Volume2" size={18} />
									</button>
								</div>

								<div className="h-full flex flex-col">
									{/* Quick actions docked at top */}
									{quickActionsVisible && quickActionsDock === 'top' && (
										<div className="border-b border-gray-200">
											<div className="max-h-64 overflow-y-auto">
												<QuickActionButtons
													currentLanguage={currentLanguage}
													onQuickAction={onQuickAction}
												/>
											</div>
										</div>
									)}
							{/* Messages list */}
							<ConversationHistory
								messages={messages}
								currentLanguage={currentLanguage}
								onQuickAction={onQuickAction}
								isTyping={isTyping}
							/>

											{/* Quick actions docked at bottom */}
											{quickActionsVisible && quickActionsDock === 'bottom' && (
												<div className="border-t border-gray-200">
													<div className="max-h-64 overflow-y-auto">
														<QuickActionButtons
															currentLanguage={currentLanguage}
															onQuickAction={onQuickAction}
														/>
													</div>
												</div>
											)}

							{/* Chat input */}
							<ChatInput
								currentLanguage={currentLanguage}
								onSendMessage={onSendMessage}
								isTyping={isTyping}
								onVoiceInput={handleVoiceInputToggle}
								isListening={isListening}
								initialText={liveTranscript}
							/>
						</div>
					</section>

					{/* Insights side panel (xl+) */}
					{showInsightPanel && (
						<aside className="hidden xl:block">
							<AIInsightPanel
								currentLanguage={currentLanguage}
								userProfile={isAuthenticated ? {} : null}
								onViewDetails={onViewInsightDetails}
							/>
						</aside>
					)}
				</div>
			</main>
		</div>
	);
};

export default AIAdvisorChatInterface;
