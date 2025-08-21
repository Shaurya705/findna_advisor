import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SecurityEducation = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [expandedTopic, setExpandedTopic] = useState(null);

  const securityTopics = {
    english: [
      {
        id: 'passwords',
        title: 'Strong Password Creation',
        icon: 'Key',
        summary: 'Learn how to create and manage secure passwords for all your financial accounts',
        content: `Creating strong passwords is your first line of defense against cyber threats. Here are essential guidelines:

• Use at least 12 characters with a mix of uppercase, lowercase, numbers, and symbols
• Avoid personal information like birthdays, names, or common words
• Use unique passwords for each financial account
• Consider using a password manager to generate and store complex passwords
• Enable two-factor authentication wherever possible
• Change passwords immediately if you suspect a breach

Example of a strong password: MyBank@2025#Secure!`
      },
      {
        id: 'phishing',
        title: 'Identifying Phishing Attacks',
        icon: 'AlertTriangle',
        summary: 'Recognize and avoid fraudulent emails, messages, and websites targeting your financial data',
        content: `Phishing attacks are becoming increasingly sophisticated. Stay protected by:

• Verifying sender email addresses carefully - look for subtle misspellings
• Never clicking links in suspicious emails - type URLs directly into your browser
• Checking for HTTPS and proper certificates on financial websites
• Being wary of urgent requests for personal or financial information
• Contacting your bank directly if you receive suspicious communications
• Never sharing OTPs, passwords, or PINs with anyone over phone or email

Red flags: Urgent language, poor grammar, generic greetings, suspicious attachments`
      },
      {
        id: 'mobile',
        title: 'Mobile Banking Security',
        icon: 'Smartphone',
        summary: 'Best practices for secure mobile banking and financial app usage',
        content: `Mobile devices are prime targets for financial fraud. Secure your mobile banking:

• Download apps only from official app stores (Google Play, Apple App Store)
• Keep your device OS and apps updated with latest security patches
• Use device lock screens with PINs, patterns, or biometric authentication
• Avoid banking on public Wi-Fi networks - use mobile data instead
• Log out of banking apps after each session
• Enable app-specific PINs or biometric locks for financial apps
• Regularly review app permissions and revoke unnecessary access

Never: Save banking passwords in browsers, use banking apps on rooted/jailbroken devices`
      },
      {
        id: 'social',
        title: 'Social Engineering Awareness',
        icon: 'Users',
        summary: 'Understand how fraudsters manipulate people to steal financial information',
        content: `Social engineering attacks exploit human psychology rather than technical vulnerabilities:

• Be skeptical of unsolicited calls claiming to be from your bank
• Never share personal information with callers, even if they seem legitimate
• Banks will never ask for passwords, PINs, or OTPs over phone
• Be cautious about sharing financial information on social media
• Verify the identity of anyone requesting sensitive information
• Trust your instincts - if something feels wrong, it probably is
• Report suspicious contacts to your bank and local authorities

Common tactics: Impersonation, urgency creation, authority claims, fear tactics`
      }
    ],
    hindi: [
      {
        id: 'passwords',
        title: 'मजबूत पासवर्ड बनाना',
        icon: 'Key',
        summary: 'अपने सभी वित्तीय खातों के लिए सुरक्षित पासवर्ड कैसे बनाएं और प्रबंधित करें',
        content: `मजबूत पासवर्ड साइबर खतरों के खिलाफ आपकी पहली सुरक्षा है। यहाँ आवश्यक दिशानिर्देश हैं:

• कम से कम 12 अक्षरों का उपयोग करें जिसमें बड़े अक्षर, छोटे अक्षर, संख्याएं और प्रतीक हों
• व्यक्तिगत जानकारी जैसे जन्मदिन, नाम या सामान्य शब्दों से बचें
• हर वित्तीय खाते के लिए अलग पासवर्ड का उपयोग करें
• जटिल पासवर्ड बनाने और स्टोर करने के लिए पासवर्ड मैनेजर का उपयोग करें
• जहाँ भी संभव हो दो-कारक प्रमाणीकरण सक्षम करें
• यदि आपको संदेह है कि आपका खाता हैक हुआ है तो तुरंत पासवर्ड बदलें

मजबूत पासवर्ड का उदाहरण: MyBank@2025#Secure!`
      },
      {
        id: 'phishing',
        title: 'फिशिंग हमलों की पहचान',
        icon: 'AlertTriangle',
        summary: 'आपके वित्तीय डेटा को लक्षित करने वाले धोखाधड़ी वाले ईमेल, संदेश और वेबसाइटों को पहचानें और उनसे बचें',
        content: `फिशिंग हमले तेजी से परिष्कृत होते जा रहे हैं। सुरक्षित रहें:

• भेजने वाले के ईमेल पते को सावधानीपूर्वक सत्यापित करें - सूक्ष्म गलत वर्तनी देखें
• संदिग्ध ईमेल में लिंक पर कभी क्लिक न करें - URL को सीधे अपने ब्राउज़र में टाइप करें
• वित्तीय वेबसाइटों पर HTTPS और उचित प्रमाणपत्रों की जांच करें
• व्यक्तिगत या वित्तीय जानकारी के लिए तत्काल अनुरोधों से सावधान रहें
• यदि आपको संदिग्ध संचार प्राप्त होता है तो सीधे अपने बैंक से संपर्क करें
• फोन या ईमेल पर किसी के साथ OTP, पासवर्ड या PIN कभी साझा न करें

खतरे के संकेत: तत्काल भाषा, खराब व्याकरण, सामान्य अभिवादन, संदिग्ध अटैचमेंट`
      },
      {
        id: 'mobile',
        title: 'मोबाइल बैंकिंग सुरक्षा',
        icon: 'Smartphone',
        summary: 'सुरक्षित मोबाइल बैंकिंग और वित्तीय ऐप उपयोग के लिए सर्वोत्तम प्रथाएं',
        content: `मोबाइल डिवाइस वित्तीय धोखाधड़ी के मुख्य लक्ष्य हैं। अपनी मोबाइल बैंकिंग को सुरक्षित करें:

• केवल आधिकारिक ऐप स्टोर (Google Play, Apple App Store) से ऐप डाउनलोड करें
• अपने डिवाइस OS और ऐप्स को नवीनतम सुरक्षा पैच के साथ अपडेट रखें
• PIN, पैटर्न या बायोमेट्रिक प्रमाणीकरण के साथ डिवाइस लॉक स्क्रीन का उपयोग करें
• सार्वजनिक Wi-Fi नेटवर्क पर बैंकिंग से बचें - इसके बजाय मोबाइल डेटा का उपयोग करें
• प्रत्येक सत्र के बाद बैंकिंग ऐप से लॉग आउट करें
• वित्तीय ऐप्स के लिए ऐप-विशिष्ट PIN या बायोमेट्रिक लॉक सक्षम करें
• नियमित रूप से ऐप अनुमतियों की समीक्षा करें और अनावश्यक पहुंच रद्द करें

कभी न करें: ब्राउज़र में बैंकिंग पासवर्ड सेव करना, रूटेड/जेलब्रोकन डिवाइस पर बैंकिंग ऐप का उपयोग`
      },
      {
        id: 'social',
        title: 'सामाजिक इंजीनियरिंग जागरूकता',
        icon: 'Users',
        summary: 'समझें कि धोखेबाज वित्तीय जानकारी चुराने के लिए लोगों को कैसे हेरफेर करते हैं',
        content: `सामाजिक इंजीनियरिंग हमले तकनीकी कमजोरियों के बजाय मानव मनोविज्ञान का शोषण करते हैं:

• अपने बैंक होने का दावा करने वाली अवांछित कॉलों पर संदेह करें
• कॉल करने वालों के साथ व्यक्तिगत जानकारी कभी साझा न करें, भले ही वे वैध लगें
• बैंक कभी भी फोन पर पासवर्ड, PIN या OTP नहीं मांगेंगे
• सोशल मीडिया पर वित्तीय जानकारी साझा करने में सावधान रहें
• संवेदनशील जानकारी का अनुरोध करने वाले किसी भी व्यक्ति की पहचान सत्यापित करें
• अपनी प्रवृत्ति पर भरोसा करें - यदि कुछ गलत लगता है, तो शायद यह गलत है
• संदिग्ध संपर्कों की रिपोर्ट अपने बैंक और स्थानीय अधिकारियों को करें

सामान्य रणनीति: नकल करना, तात्कालिकता पैदा करना, अधिकार का दावा, डर की रणनीति`
      }
    ]
  };

  const currentTopics = securityTopics?.[selectedLanguage];

  const toggleTopic = (topicId) => {
    setExpandedTopic(expandedTopic === topicId ? null : topicId);
  };

  return (
    <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-growth to-prosperity rounded-lg flex items-center justify-center">
            <Icon name="GraduationCap" size={20} color="white" strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-text-primary">Security Education</h2>
            <p className="text-sm text-text-secondary">Learn to protect yourself across all financial platforms</p>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button
            variant={selectedLanguage === 'english' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedLanguage('english')}
          >
            English
          </Button>
          <Button
            variant={selectedLanguage === 'hindi' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedLanguage('hindi')}
          >
            हिंदी
          </Button>
        </div>
      </div>
      <div className="space-y-4">
        {currentTopics?.map((topic) => (
          <div key={topic?.id} className="border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => toggleTopic(topic?.id)}
              className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name={topic?.icon} size={16} className="text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-text-primary">{topic?.title}</h3>
                  <p className="text-sm text-text-secondary mt-1">{topic?.summary}</p>
                </div>
                <Icon 
                  name={expandedTopic === topic?.id ? "ChevronUp" : "ChevronDown"} 
                  size={20} 
                  className="text-text-secondary" 
                />
              </div>
            </button>
            
            {expandedTopic === topic?.id && (
              <div className="px-4 pb-4 border-t border-border bg-gray-50">
                <div className="pt-4">
                  <div className="prose prose-sm max-w-none">
                    {topic?.content?.split('\n')?.map((line, index) => {
                      if (line?.trim() === '') return <br key={index} />;
                      if (line?.startsWith('•')) {
                        return (
                          <div key={index} className="flex items-start space-x-2 mb-2">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-sm text-text-secondary">{line?.substring(1)?.trim()}</span>
                          </div>
                        );
                      }
                      return (
                        <p key={index} className="text-sm text-text-secondary mb-2 leading-relaxed">
                          {line}
                        </p>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Phone" size={16} className="text-primary" />
            <h4 className="font-medium text-primary">
              {selectedLanguage === 'hindi' ? 'सुरक्षा हेल्पलाइन' : 'Security Helpline'}
            </h4>
          </div>
          <p className="text-sm text-text-secondary mb-2">
            {selectedLanguage === 'hindi' ?'संदिग्ध गतिविधि की रिपोर्ट करें या सुरक्षा सहायता प्राप्त करें' :'Report suspicious activity or get security assistance'
            }
          </p>
          <p className="text-sm font-medium text-primary">1800-123-SAFE (7233)</p>
        </div>

        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Mail" size={16} className="text-success" />
            <h4 className="font-medium text-success">
              {selectedLanguage === 'hindi' ? 'सुरक्षा अलर्ट' : 'Security Alerts'}
            </h4>
          </div>
          <p className="text-sm text-text-secondary mb-2">
            {selectedLanguage === 'hindi' ?'नवीनतम सुरक्षा खतरों और सुरक्षा युक्तियों के बारे में अपडेट प्राप्त करें' :'Get updates about latest security threats and protection tips'
            }
          </p>
          <Button variant="outline" size="sm">
            {selectedLanguage === 'hindi' ? 'सब्सक्राइब करें' : 'Subscribe'}
          </Button>
        </div>
      </div>
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5" />
          <div>
            <h4 className="font-medium text-warning mb-1">
              {selectedLanguage === 'hindi' ? 'महत्वपूर्ण अनुस्मारक' : 'Important Reminder'}
            </h4>
            <p className="text-sm text-text-secondary">
              {selectedLanguage === 'hindi' ?'FinDNA Advisor या कोई भी वैध वित्तीय संस्थान कभी भी फोन, ईमेल या SMS के माध्यम से आपके पासवर्ड, PIN या OTP नहीं मांगेगा। यदि आपको ऐसा कोई अनुरोध प्राप्त होता है, तो तुरंत हमारी सुरक्षा टीम से संपर्क करें।' :'FinDNA Advisor or any legitimate financial institution will never ask for your passwords, PINs, or OTPs via phone, email, or SMS. If you receive such requests, contact our security team immediately.'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityEducation;