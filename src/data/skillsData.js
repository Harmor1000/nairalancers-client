export const skillSuggestions = [
  // Programming & Tech
  "JavaScript", "Python", "React", "Node.js", "HTML", "CSS", "PHP", "Java", "C++", "C#",
  "Angular", "Vue.js", "TypeScript", "SQL", "MongoDB", "PostgreSQL", "MySQL", "Git",
  "Docker", "Kubernetes", "AWS", "Azure", "Google Cloud", "Firebase", "REST API",
  "GraphQL", "WordPress", "Shopify", "Laravel", "Django", "Express.js", "Flutter",
  "React Native", "Swift", "Kotlin", "Android Development", "iOS Development",
  "Machine Learning", "Data Science", "Artificial Intelligence", "Blockchain",
  "Cybersecurity", "DevOps", "Linux", "Windows Server", "Networking",

  // Design & Creative
  "Adobe Photoshop", "Adobe Illustrator", "Adobe InDesign", "Adobe After Effects",
  "Adobe Premiere Pro", "Figma", "Sketch", "Canva", "CorelDRAW", "3D Modeling",
  "Blender", "AutoCAD", "SketchUp", "UI/UX Design", "Graphic Design", "Web Design",
  "Logo Design", "Brand Identity", "Typography", "Color Theory", "Animation",
  "Video Editing", "Motion Graphics", "Photography", "Photo Editing",

  // Marketing & Business
  "Digital Marketing", "SEO", "SEM", "Google Ads", "Facebook Ads", "Social Media Marketing",
  "Content Marketing", "Email Marketing", "Affiliate Marketing", "Copywriting",
  "Content Writing", "Blog Writing", "Technical Writing", "Grant Writing",
  "Business Analysis", "Project Management", "Agile", "Scrum", "Product Management",
  "Market Research", "Data Analysis", "Google Analytics", "Excel", "PowerPoint",
  "Lead Generation", "Sales", "Customer Service", "CRM", "HubSpot", "Salesforce",

  // Finance & Accounting
  "Bookkeeping", "Financial Analysis", "Excel", "QuickBooks", "Accounting",
  "Tax Preparation", "Financial Modeling", "Investment Analysis", "Budgeting",
  "Auditing", "Payroll", "Financial Reporting", "Cost Accounting",

  // Writing & Translation
  "Content Writing", "Copywriting", "Technical Writing", "Creative Writing",
  "Academic Writing", "Blog Writing", "SEO Writing", "Proofreading", "Editing",
  "Translation", "Transcription", "Research", "Journalism", "Press Releases",

  // Audio & Music
  "Audio Editing", "Music Production", "Sound Design", "Voice Over", "Mixing",
  "Mastering", "Composition", "Podcast Production", "Audiobook Production",
  "Logic Pro", "Pro Tools", "Ableton Live", "FL Studio",

  // Video & Animation
  "Video Editing", "Motion Graphics", "3D Animation", "2D Animation", "Visual Effects",
  "Color Grading", "Video Production", "Cinematography", "Storyboarding",
  "Adobe After Effects", "Adobe Premiere Pro", "Final Cut Pro", "DaVinci Resolve",

  // Other Professional Skills
  "Virtual Assistant", "Data Entry", "Customer Support", "Chat Support",
  "Administrative Support", "Email Management", "Calendar Management",
  "Online Research", "Lead Generation", "CRM Management", "Event Planning",
  "Human Resources", "Recruitment", "Training", "Consulting", "Coaching",
  "Teaching", "Tutoring", "Language Teaching", "Online Teaching"
];

export const languageSuggestions = [
  "English", "Mandarin Chinese", "Hindi", "Spanish", "French", "Standard Arabic",
  "Bengali", "Russian", "Portuguese", "Indonesian", "Urdu", "German", "Japanese",
  "Swahili", "Marathi", "Telugu", "Turkish", "Tamil", "Yue Chinese", "Vietnamese",
  "Tagalog", "Wu Chinese", "Korean", "Iranian Persian", "Hausa", "Egyptian Arabic",
  "Thai", "Gujarati", "Jin Chinese", "Min Nan Chinese", "Kannada", "Italian",
  "Amharic", "Malayalam", "Odia", "Burmese", "Eastern Punjabi", "Maithili",
  "Igbo", "Uzbek", "Sindhi", "Romanian", "Yoruba", "Cebuano", "Dutch", "Kurdish",
  "Serbo-Croatian", "Malagasy", "Saraiki", "Nepali", "Sinhala", "Chittagonian",
  "Zhuang", "Khmer", "Turkmen", "Assamese", "Madurese", "Somali", "Marwari",
  "Magahi", "Haryanvi", "Hungarian", "Chhattisgarhi", "Greek", "Chewa", "Deccan",
  "Akan", "Kazakh", "Min Bei Chinese", "Sylheti", "Zulu", "Czech", "Kinyarwanda",
  "Dhundhari", "Haitian Creole", "Eastern Min", "Ilocano", "Quechua", "Kirundi",
  "Swedish", "Hmong", "Shona", "Uyghur", "Hiligaynon", "Mossi", "Xhosa", "Belarusian",
  "Balochi", "Konkani"
];

export const languageLevels = [
  "Basic",
  "Conversational", 
  "Fluent",
  "Native"
];

export const filterSuggestions = (suggestions, query) => {
  if (!query || query.length < 2) return [];
  
  const lowercaseQuery = query.toLowerCase();
  return suggestions
    .filter(suggestion => 
      suggestion.toLowerCase().includes(lowercaseQuery)
    )
    .sort((a, b) => {
      // Prioritize suggestions that start with the query
      const aStartsWith = a.toLowerCase().startsWith(lowercaseQuery);
      const bStartsWith = b.toLowerCase().startsWith(lowercaseQuery);
      
      if (aStartsWith && !bStartsWith) return -1;
      if (!aStartsWith && bStartsWith) return 1;
      
      // Then sort by length (shorter matches first)
      return a.length - b.length;
    })
    .slice(0, 8); // Limit to 8 suggestions
};
