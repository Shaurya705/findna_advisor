import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const SocialProofSection = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = {
    en: [
      {
        id: 1,
        name: "Priya Sharma",
        location: "Mumbai, Maharashtra", 
        role: "Software Engineer",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        rating: 5,
        text: "FinDNA's AI advisor helped me save ₹65,000 in taxes last year. The Hindi support made it so easy to understand complex financial concepts. It's like having a family financial advisor who speaks my language!",
        highlight: "₹65,000 tax savings",
        category: "Tax Optimization"
      },
      {
        id: 2,
        name: "Rajesh Kumar",
        location: "Delhi, NCR",
        role: "Business Owner",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        rating: 5,
        text: "The retirement planning feature considers my joint family responsibilities and festival expenses. Finally, a platform that understands Indian family dynamics. My retirement corpus grew by 40% with their guidance.",
        highlight: "40% portfolio growth",
        category: "Retirement Planning"
      },
      {
        id: 3,
        name: "Anita Patel",
        location: "Ahmedabad, Gujarat",
        role: "Doctor",
        avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
        rating: 5,
        text: "The vernacular AI is incredible! I can ask questions in Hindi about my investments and get detailed explanations. The cultural context awareness is what sets FinDNA apart from other platforms.",
        highlight: "Vernacular AI Support",
        category: "AI Advisory"
      }
    ],
    hi: [
      {
        id: 1,
        name: "प्रिया शर्मा",
        location: "मुंबई, महाराष्ट्र",
        role: "सॉफ्टवेयर इंजीनियर",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        rating: 5,
        text: "FinDNA के AI सलाहकार ने मुझे पिछले साल ₹65,000 टैक्स बचाने में मदद की। हिंदी समर्थन ने जटिल वित्तीय अवधारणाओं को समझना बहुत आसान बना दिया। यह एक पारिवारिक वित्तीय सलाहकार जैसा है!",
        highlight: "₹65,000 टैक्स बचत",
        category: "कर अनुकूलन"
      },
      {
        id: 2,
        name: "राजेश कुमार",
        location: "दिल्ली, NCR",
        role: "व्यापारी",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        rating: 5,
        text: "रिटायरमेंट प्लानिंग फीचर मेरी संयुक्त पारिवारिक जिम्मेदारियों और त्योहारी खर्चों को ध्यान में रखता है। आखिरकार, एक प्लेटफॉर्म जो भारतीय पारिवारिक गतिशीलता को समझता है।",
        highlight: "40% पोर्टफोलियो वृद्धि",
        category: "सेवानिवृत्ति योजना"
      },
      {
        id: 3,
        name: "अनीता पटेल",
        location: "अहमदाबाद, गुजरात",
        role: "डॉक्टर",
        avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
        rating: 5,
        text: "देशी भाषा AI अविश्वसनीय है! मैं अपने निवेश के बारे में हिंदी में सवाल पूछ सकती हूं और विस्तृत स्पष्टीकरण पा सकती हूं। सांस्कृतिक संदर्भ जागरूकता FinDNA को अलग बनाती है।",
        highlight: "देशी भाषा AI समर्थन",
        category: "AI सलाहकार"
      }
    ]
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setCurrentLanguage(savedLanguage);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials?.[currentLanguage]?.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentLanguage]);

  const mediaRecognition = {
    en: [
      { name: "Economic Times", logo: "Newspaper", text: "Best Fintech Innovation 2024" },
      { name: "Business Standard", logo: "Award", text: "Top AI-Powered Platform" },
      { name: "Mint", logo: "Star", text: "Editor's Choice Award" },
      { name: "MoneyControl", logo: "TrendingUp", text: "Most Trusted Platform" }
    ],
    hi: [
      { name: "इकोनॉमिक टाइम्स", logo: "Newspaper", text: "बेस्ट फिनटेक इनोवेशन 2024" },
      { name: "बिजनेस स्टैंडर्ड", logo: "Award", text: "टॉप AI-पावर्ड प्लेटफॉर्म" },
      { name: "मिंट", logo: "Star", text: "एडिटर्स चॉइस अवार्ड" },
      { name: "मनी कंट्रोल", logo: "TrendingUp", text: "सबसे भरोसेमंद प्लेटफॉर्म" }
    ]
  };

  const sectionContent = {
    en: {
      title: "Trusted by Diverse Indian Users",
      subtitle: "Real stories from users who've transformed their financial future with cultural understanding and technological sophistication",
      mediaTitle: "Media Recognition"
    },
    hi: {
      title: "विविध भारतीय उपयोगकर्ताओं का भरोसा",
      subtitle: "उन उपयोगकर्ताओं की वास्तविक कहानियां जिन्होंने सांस्कृतिक समझ और तकनीकी परिष्कार के साथ अपना वित्तीय भविष्य बदला है",
      mediaTitle: "मीडिया मान्यता"
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
            {sectionContent?.[currentLanguage]?.title}
          </h2>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto">
            {sectionContent?.[currentLanguage]?.subtitle}
          </p>
        </div>

        {/* Main Testimonial */}
        <div className="mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12 border border-border relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-cultural opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-prosperity/20 rounded-full translate-y-12 -translate-x-12"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <Image
                      src={testimonials?.[currentLanguage]?.[currentTestimonial]?.avatar}
                      alt={testimonials?.[currentLanguage]?.[currentTestimonial]?.name}
                      className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-success rounded-full flex items-center justify-center border-2 border-white">
                      <Icon name="Check" size={14} color="white" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 text-center lg:text-left">
                  {/* Rating */}
                  <div className="flex justify-center lg:justify-start space-x-1 mb-4">
                    {[...Array(5)]?.map((_, i) => (
                      <Icon key={i} name="Star" size={16} className="text-prosperity fill-current" />
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-lg lg:text-xl text-text-primary mb-6 leading-relaxed">
                    "{testimonials?.[currentLanguage]?.[currentTestimonial]?.text}"
                  </blockquote>

                  {/* User Info */}
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <h4 className="font-semibold text-text-primary text-lg">
                        {testimonials?.[currentLanguage]?.[currentTestimonial]?.name}
                      </h4>
                      <p className="text-text-secondary">
                        {testimonials?.[currentLanguage]?.[currentTestimonial]?.role} • {testimonials?.[currentLanguage]?.[currentTestimonial]?.location}
                      </p>
                    </div>
                    
                    <div className="mt-4 lg:mt-0 flex items-center space-x-4">
                      <div className="px-4 py-2 bg-prosperity/10 rounded-full">
                        <span className="text-sm font-medium text-prosperity">
                          {testimonials?.[currentLanguage]?.[currentTestimonial]?.highlight}
                        </span>
                      </div>
                      <div className="px-4 py-2 bg-primary/10 rounded-full">
                        <span className="text-sm font-medium text-primary">
                          {testimonials?.[currentLanguage]?.[currentTestimonial]?.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Testimonial Navigation */}
          <div className="flex justify-center mt-6 space-x-2">
            {testimonials?.[currentLanguage]?.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentTestimonial ? 'bg-primary scale-125' : 'bg-border hover:bg-primary/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Media Recognition */}
        <div className="text-center mb-12">
          <h3 className="text-2xl font-bold text-text-primary mb-8">
            {sectionContent?.[currentLanguage]?.mediaTitle}
          </h3>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {mediaRecognition?.[currentLanguage]?.map((media, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-border group hover:scale-105"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-gradient-cultural rounded-full flex items-center justify-center mb-4 group-hover:animate-pulse-soft">
                    <Icon name={media?.logo} size={20} color="white" />
                  </div>
                  <h4 className="font-semibold text-text-primary mb-2">{media?.name}</h4>
                  <p className="text-sm text-text-secondary">{media?.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Stats */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">4.8/5</div>
              <p className="text-text-secondary">
                {currentLanguage === 'en' ? 'Average Rating' : 'औसत रेटिंग'}
              </p>
            </div>
            <div>
              <div className="text-3xl font-bold text-prosperity mb-2">15+</div>
              <p className="text-text-secondary">
                {currentLanguage === 'en' ? 'Languages Supported' : 'समर्थित भाषाएं'}
              </p>
            </div>
            <div>
              <div className="text-3xl font-bold text-growth mb-2">99.9%</div>
              <p className="text-text-secondary">
                {currentLanguage === 'en' ? 'Uptime Guarantee' : 'अपटाइम गारंटी'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;