import React, { useState, useEffect } from 'react';
import './CheckInFlow.css';

const CheckInFlow = () => {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [userResponses, setUserResponses] = useState({});
  const [draggingItem, setDraggingItem] = useState(null);
  const [userName, setUserName] = useState('');
  const [profession, setProfession] = useState('');
  const [field, setField] = useState('');
  const [theme, setTheme] = useState({ primary: '#4776E6', secondary: '#8E54E9' });
  const [progress, setProgress] = useState(0);
  const [selectedVision, setSelectedVision] = useState(null);
  const [streakCount, setStreakCount] = useState(1);
  const [showStreakBadge, setShowStreakBadge] = useState(false);

  // Calculate and update progress
  useEffect(() => {
    // Set total number of screens (excluding intro, onboarding and final)
    const totalScreens = 7;
    const currentProgress = currentScreen === 0 ? 0 : 
                           (currentScreen === totalScreens + 3) ? 100 : 
                           Math.min(Math.round((currentScreen - 2) * (100 / totalScreens)), 95);
    setProgress(currentProgress);
    
    // Simulate streak on app load
    const randomStreak = Math.floor(Math.random() * 5) + 1;
    setStreakCount(randomStreak);
    
    // Show streak badge with animation
    if (currentScreen === 0) {
      setTimeout(() => {
        setShowStreakBadge(true);
        
        // Hide after a few seconds
        setTimeout(() => {
          setShowStreakBadge(false);
        }, 4000);
      }, 1000);
    }
  }, [currentScreen]);

  const handleResponse = (question, response) => {
    setUserResponses({
      ...userResponses,
      [question]: response
    });
    setCurrentScreen(currentScreen + 1);
  };

  const handleDragStart = (e, item) => {
    setDraggingItem(item);
    // Add visual feedback during drag
    e.currentTarget.classList.add('dragging');
    // Required for Firefox
    e.dataTransfer.setData('text/plain', item);
    // Set drag image
    const dragImage = e.currentTarget.cloneNode(true);
    dragImage.style.opacity = '0.5';
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 0, 0);
    setTimeout(() => {
      document.body.removeChild(dragImage);
    }, 0);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    const draggables = document.querySelectorAll('.draggable-item:not(.dragging)');
    const dragging = document.querySelector('.dragging');
    const container = document.querySelector('.drag-container');
    
    if (!dragging || !container) return;
    
    // Find the element we're dragging over
    let closestElement = null;
    let closestOffset = Number.NEGATIVE_INFINITY;
    
    draggables.forEach(draggable => {
      const box = draggable.getBoundingClientRect();
      const offset = e.clientY - box.top - box.height / 2;
      
      if (offset < 0 && offset > closestOffset) {
        closestOffset = offset;
        closestElement = draggable;
      }
    });
    
    if (closestElement) {
      container.insertBefore(dragging, closestElement);
    } else {
      container.appendChild(dragging);
    }
  };

  const handleDragEnd = (e) => {
    // Remove visual feedback
    e.currentTarget.classList.remove('dragging');
    setDraggingItem(null);
  };

  const getMotivationTips = () => {
    // Personalized tips based on the user's field
    const generalTips = [
      "Break large goals into small, achievable tasks",
      "Celebrate small wins to maintain momentum",
      "Find an accountability partner in your field",
      "Regularly reflect on your progress and learnings"
    ];
    
    const fieldSpecificTips = {
      'technology': [
        "Contribute to open-source projects to build your portfolio",
        "Join online communities like Stack Overflow or GitHub",
        "Build small projects that solve real problems"
      ],
      'design': [
        "Create a portfolio that showcases your unique style",
        "Study design systems from companies you admire",
        "Join design challenges to push your creativity"
      ],
      'business': [
        "Network strategically with industry leaders",
        "Find a mentor who has succeeded in your niche",
        "Develop a unique value proposition for your services"
      ],
      'healthcare': [
        "Stay updated with the latest research in your specialty",
        "Join professional associations for networking",
        "Focus on patient outcomes to stay motivated"
      ],
      'education': [
        "Experiment with innovative teaching methods",
        "Collect feedback to improve your approach",
        "Connect with other educators for inspiration"
      ]
    };
    
    // Default to technology if no field is selected or if the field doesn't match
    const userField = field.toLowerCase();
    const fieldTips = Object.keys(fieldSpecificTips).includes(userField) 
      ? fieldSpecificTips[userField] 
      : fieldSpecificTips['technology'];
    
    return [...generalTips, ...fieldTips].slice(0, 5);
  };

  const renderProgressBar = () => {
    // Don't show progress bar on intro or onboarding screens
    if (currentScreen <= 2) return null;
    
    return (
      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary})` }}></div>
      </div>
    );
  };

  const renderScreen = () => {
    switch(currentScreen) {
      case 0:
        return (
          <div className="screen intro-screen">
            {showStreakBadge && (
              <div className="streak-badge">
                <span className="streak-flame">🔥</span>
                <span className="streak-count">{streakCount}</span>
                <span className="streak-label">day streak!</span>
              </div>
            )}
            <div className="app-logo">
              <span className="logo-icon">🧠</span>
            </div>
            <h1>Mind Mirror</h1>
            <p className="intro-text">Your personal reflection companion for staying motivated and focused</p>
            <div className="animation-container">
              <div className="floating-elements">
                <div className="float-element" style={{ animationDelay: '0s', background: theme.primary }}>✨</div>
                <div className="float-element" style={{ animationDelay: '1s', background: theme.secondary }}>🧠</div>
                <div className="float-element" style={{ animationDelay: '2s', background: theme.primary }}>💡</div>
                <div className="float-element" style={{ animationDelay: '0.5s', background: theme.secondary }}>🚀</div>
                <div className="float-element" style={{ animationDelay: '1.5s', background: theme.primary }}>⭐</div>
              </div>
            </div>
            <button 
              className="cta-button"
              onClick={() => setCurrentScreen(1)}
              style={{ background: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary})` }}
            >
              Get Started
            </button>
            <div className="premium-badge">
              <span className="premium-icon">⭐</span>
              <span>Premium</span>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="screen onboarding-screen">
            <h1>Welcome!</h1>
            <p className="subtitle">Let's personalize your experience</p>
            
            <div className="onboarding-form">
              <div className="form-group">
                <label htmlFor="name">Your name</label>
                <input 
                  id="name" 
                  type="text" 
                  placeholder="Enter your name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  autoComplete="off"
                />
              </div>
              <div className="form-group">
                <label htmlFor="profession">What do you do?</label>
                <input 
                  id="profession" 
                  type="text" 
                  placeholder="Your profession or role"
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  autoComplete="off"
                />
              </div>
              <div className="form-group">
                <label htmlFor="field">Your field or industry</label>
                <select 
                  id="field"
                  value={field}
                  onChange={(e) => setField(e.target.value)}
                >
                  <option value="">Select your field</option>
                  <option value="technology">Technology & Engineering</option>
                  <option value="design">Design & Creative</option>
                  <option value="business">Business & Finance</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="education">Education</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Choose your color theme</label>
                <div className="theme-selector">
                  <div 
                    className={`theme-option ${theme.primary === '#4776E6' ? 'selected' : ''}`} 
                    onClick={() => setTheme({ primary: '#4776E6', secondary: '#8E54E9' })}
                    style={{ background: 'linear-gradient(90deg, #4776E6, #8E54E9)' }}
                  ></div>
                  <div 
                    className={`theme-option ${theme.primary === '#FF5F6D' ? 'selected' : ''}`} 
                    onClick={() => setTheme({ primary: '#FF5F6D', secondary: '#FFC371' })}
                    style={{ background: 'linear-gradient(90deg, #FF5F6D, #FFC371)' }}
                  ></div>
                  <div 
                    className={`theme-option ${theme.primary === '#11998e' ? 'selected' : ''}`} 
                    onClick={() => setTheme({ primary: '#11998e', secondary: '#38ef7d' })}
                    style={{ background: 'linear-gradient(90deg, #11998e, #38ef7d)' }}
                  ></div>
                  <div 
                    className={`theme-option ${theme.primary === '#834d9b' ? 'selected' : ''}`} 
                    onClick={() => setTheme({ primary: '#834d9b', secondary: '#d04ed6' })}
                    style={{ background: 'linear-gradient(90deg, #834d9b, #d04ed6)' }}
                  ></div>
                </div>
              </div>
            </div>
            
            <button 
              className="cta-button"
              onClick={() => setCurrentScreen(2)}
              disabled={!userName.trim()}
              style={{ 
                background: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary})`,
                opacity: !userName.trim() ? 0.7 : 1 
              }}
            >
              {!userName.trim() ? 'Please enter your name' : 'Continue'}
            </button>
          </div>
        );
      case 2:
        return (
          <div className="screen welcome-screen">
            <h1 style={{ background: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Hi {userName}!
            </h1>
            <h2>Today's Focus</h2>
            <div className="theme-card">
              <h3 style={{ color: theme.primary }}>Staying Motivated in a Competitive Field</h3>
              <p>Let's explore how to maintain your drive while navigating the competitive world of {field || 'your industry'}.</p>
            </div>
            <button 
              className="cta-button"
              onClick={() => setCurrentScreen(3)}
              style={{ background: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary})` }}
            >
              Let's Begin
            </button>
          </div>
        );
      case 3:
        return (
          <div className="screen">
            <h1 style={{ background: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Comparison Check
            </h1>
            <p className="subtitle">Let's reflect on where you are today.</p>
            
            <div className="interaction-card">
              <p>How much are you comparing yourself to others right now?</p>
              <div className="slider-container">
                <span>Hardly at all</span>
                <input 
                  type="range" 
                  min="1" 
                  max="10" 
                  defaultValue="5"
                  className="custom-slider" 
                  onChange={(e) => {
                    const target = document.getElementById('slider-value');
                    if (target) target.innerText = e.target.value;
                    
                    // Visual feedback on the slider
                    const val = e.target.value;
                    const percentage = (val - 1) / 9 * 100;
                    e.target.style.background = `linear-gradient(90deg, ${theme.primary} ${percentage}%, #e0e0e0 ${percentage}%)`;
                  }}
                  style={{ 
                    background: `linear-gradient(90deg, ${theme.primary} 50%, #e0e0e0 50%)` 
                  }}
                />
                <span>Constantly</span>
                <p className="slider-value" style={{ color: theme.primary }}>Selected: <span id="slider-value">5</span>/10</p>
              </div>
              <button 
                className="cta-button"
                onClick={() => handleResponse("comparison_level", document.getElementById('slider-value').innerText)}
                style={{ background: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary})` }}
              >
                Continue
              </button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="screen">
            <h1 style={{ background: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Your Strengths
            </h1>
            <p className="subtitle">What sets you apart in your field?</p>
            
            <div className="interaction-card">
              <p>Select the areas where you feel you excel compared to others:</p>
              <div className="strength-options">
                {['Creativity', 'Technical skills', 'Problem-solving', 'Communication', 'Project execution', 'Learning speed', 'Attention to detail', 'Critical thinking'].map(strength => (
                  <div 
                    key={strength} 
                    className="strength-option"
                    onClick={(e) => {
                      e.currentTarget.classList.toggle('selected');
                    }}
                    style={{ 
                      borderColor: theme.primary, 
                      '--selected-gradient': `linear-gradient(90deg, ${theme.primary}, ${theme.secondary})`,
                    }}
                  >
                    {strength}
                  </div>
                ))}
              </div>
              <div className="selection-feedback">
                <p>Tap options to select • <span id="selected-count">0</span> selected</p>
              </div>
              <button 
                className="cta-button"
                onClick={() => {
                  const selected = Array.from(document.querySelectorAll('.strength-option.selected'))
                    .map(el => el.innerText);
                  handleResponse("strengths", selected);
                }}
                style={{ background: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary})` }}
              >
                Continue
              </button>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="screen">
            <h1 style={{ background: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Energy Allocation
            </h1>
            <p className="subtitle">Where is your focus going?</p>
            
            <div className="interaction-card">
              <p>Drag and arrange these activities based on how much time you spend on them:</p>
              <div className="drag-container">
                {[
                  'Core Professional Skills', 
                  'Side Projects', 
                  'Learning New Techniques', 
                  'Networking Events', 
                  'Industry News & Trends'
                ].map((item, index) => (
                  <div 
                    key={item}
                    className="draggable-item"
                    draggable="true"
                    onDragStart={(e) => handleDragStart(e, item)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                  >
                    <span className="drag-handle">≡</span>
                    <span className="drag-number">{index + 1}</span>
                    {item}
                  </div>
                ))}
              </div>
              <p className="drag-tip">Tip: Drag items to reorder them • Most time at top</p>
              <button 
                className="cta-button"
                onClick={() => {
                  const orderedItems = Array.from(document.querySelectorAll('.draggable-item'))
                    .map((el, index) => ({
                      activity: el.textContent.replace(/[≡\d]/g, '').trim(),
                      rank: index + 1
                    }));
                  handleResponse("time_allocation", orderedItems);
                }}
                style={{ background: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary})` }}
              >
                Continue
              </button>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="screen">
            <h1 style={{ background: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Tech Inspiration
            </h1>
            <p className="subtitle">What drives your creative energy?</p>
            
            <div className="interaction-card">
              <p>Tap each card to reveal insights about what motivates successful professionals:</p>
              <div className="reveal-container">
                {[
                  { title: 'Problem Focus', content: 'The most motivated professionals focus on solving real problems rather than chasing trends.' },
                  { title: 'Growth Mindset', content: 'Top performers see skills as learnable, not fixed traits. They embrace challenges as growth opportunities.' },
                  { title: 'Community Connection', content: 'Finding your tribe of like-minded builders can sustain motivation during difficult times.' }
                ].map((insight, index) => (
                  <div 
                    key={index}
                    className="reveal-card"
                    onClick={(e) => {
                      e.currentTarget.classList.toggle('revealed');
                      // Update counter
                      const revealedCount = document.querySelectorAll('.reveal-card.revealed').length;
                      const countElement = document.getElementById('cards-revealed');
                      if (countElement) countElement.textContent = revealedCount;
                    }}
                  >
                    <div 
                      className="card-front"
                      style={{ background: `linear-gradient(135deg, #f5f7fa, #e4e8f0)` }}
                    >
                      <h3 style={{ color: theme.primary }}>{insight.title}</h3>
                      <p>Tap to reveal</p>
                    </div>
                    <div 
                      className="card-back"
                      style={{ background: `linear-gradient(135deg, #ffffff, #f8f8f8)`, color: '#333' }}
                    >
                      <p>{insight.content}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="cards-revealed">
                <span id="cards-revealed">0</span> insights revealed
              </p>
              <button 
                className="cta-button"
                onClick={() => {
                  const revealedCards = document.querySelectorAll('.reveal-card.revealed').length;
                  handleResponse("insights_viewed", revealedCards);
                }}
                style={{ background: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary})` }}
              >
                Continue
              </button>
            </div>
          </div>
        );
      case 7:
        return (
          <div className="screen">
            <h1 style={{ background: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Your Motivation Plan
            </h1>
            <p className="subtitle">Let's create your personal strategy</p>
            
            <div className="interaction-card">
              <p>Select what you'd like to focus on this week:</p>
              <div className="focus-selector">
                {[
                  "Build something small but complete",
                  "Learn one new technique deeply",
                  "Connect with other professionals",
                  "Explore a completely new area"
                ].map((option, index) => (
                  <div key={index} className="focus-option">
                    <input 
                      type="radio" 
                      id={`focus${index+1}`} 
                      name="focus" 
                      value={option}
                      style={{ 
                        '--radio-color': theme.primary,
                        '--radio-gradient': `linear-gradient(90deg, ${theme.primary}, ${theme.secondary})`
                      }}
                    />
                    <label htmlFor={`focus${index+1}`}>{option}</label>
                  </div>
                ))}
              </div>
              <button 
                className="cta-button"
                onClick={() => {
                  const selected = document.querySelector('input[name="focus"]:checked');
                  handleResponse("weekly_focus", selected ? selected.value : "No selection");
                }}
                style={{ background: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary})` }}
              >
                Continue
              </button>
            </div>
          </div>
        );
      case 8:
        return (
          <div className="screen">
            <h1 style={{ background: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Motivation Boosters
            </h1>
            <p className="subtitle">Strategies to keep your momentum</p>
            
            <div className="interaction-card">
              <p>Rate how useful each strategy would be for you:</p>
              <div className="rating-container">
                {getMotivationTips().map((tip, index) => (
                  <div key={index} className="rating-item">
                    <p>{tip}</p>
                    <div className="star-rating">
                      {[1, 2, 3, 4, 5].map(star => (
                        <span 
                          key={star} 
                          className="star"
                          data-rating={star}
                          onClick={(e) => {
                            const parent = e.currentTarget.parentNode;
                            const stars = parent.querySelectorAll('.star');
                            const clickedRating = parseInt(e.currentTarget.dataset.rating);
                            
                            stars.forEach(s => {
                              const starRating = parseInt(s.dataset.rating);
                              s.classList.toggle('active', starRating <= clickedRating);
                            });
                          }}
                          style={{ '--star-color': theme.primary }}
                        >★</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <button 
                className="cta-button"
                onClick={() => {
                  const ratings = {};
                  document.querySelectorAll('.rating-item').forEach((item, index) => {
                    const tip = item.querySelector('p').textContent;
                    const activeStars = item.querySelectorAll('.star.active').length;
                    ratings[`tip_${index+1}`] = { tip, rating: activeStars };
                  });
                  handleResponse("motivation_ratings", ratings);
                }}
                style={{ background: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary})` }}
              >
                Continue
              </button>
            </div>
          </div>
        );
      case 9:
        return (
          <div className="screen">
            <h1 style={{ background: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Visualization
            </h1>
            <p className="subtitle">Create a mental image of success</p>
            
            <div className="interaction-card">
              <p>What would success in {field || 'your field'} look like for you in 1 year?</p>
              <div className="visualization-container">
                <div className="vision-options">
                  {[
                    { emoji: '🏆', text: 'Recognition from peers' },
                    { emoji: '💼', text: 'Career advancement' },
                    { emoji: '💰', text: 'Financial success' },
                    { emoji: '🧠', text: 'Mastery of skills' },
                    { emoji: '🔄', text: 'Work-life balance' },
                    { emoji: '🚀', text: 'Innovation/creation' }
                  ].map((option, index) => (
                    <div 
                      key={index}
                      className={`vision-option ${selectedVision === index ? 'selected' : ''}`}
                      onClick={() => setSelectedVision(index)}
                      style={{ 
                        borderColor: selectedVision === index ? theme.primary : '#ddd',
                        boxShadow: selectedVision === index ? `0 0 0 2px rgba(${parseInt(theme.primary.slice(1, 3), 16)}, ${parseInt(theme.primary.slice(3, 5), 16)}, ${parseInt(theme.primary.slice(5, 7), 16)}, 0.2)` : 'none'
                      }}
                    >
                      <span className="vision-emoji">{option.emoji}</span>
                      <span className="vision-text">{option.text}</span>
                    </div>
                  ))}
                </div>
                <div className="text-input">
                  <label htmlFor="vision">Describe your vision in detail:</label>
                  <textarea 
                    id="vision"
                    placeholder="One year from now, I will have..."
                    rows="4"
                  ></textarea>
                </div>
              </div>
              <button 
                className="cta-button"
                onClick={() => {
                  const textVision = document.getElementById('vision').value;
                  const selectedVisionText = selectedVision !== null 
                    ? document.querySelectorAll('.vision-option')[selectedVision].querySelector('.vision-text').textContent 
                    : null;
                  
                  handleResponse("future_vision", {
                    selected_category: selectedVisionText,
                    details: textVision || "No details provided"
                  });
                }}
                style={{ background: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary})` }}
              >
                Continue
              </button>
            </div>
          </div>
        );
      default:
        return (
          <div className="screen final-screen">
            <div className="confetti-animation">
              {Array(20).fill().map((_, i) => (
                <div 
                  key={i} 
                  className="confetti" 
                  style={{ 
                    '--delay': `${i * 0.1}s`,
                    '--color': i % 2 === 0 ? theme.primary : theme.secondary
                  }}
                ></div>
              ))}
            </div>
            
            <div className="completed-badge">
              <span className="completed-icon">✅</span>
              <span className="completed-text">Check-in Complete!</span>
              <span className="points-earned">+25 points</span>
            </div>
            
            <h1 style={{ background: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Great job, {userName}!
            </h1>
            <p>We've crafted personalized insights based on your responses.</p>
            
            <div className="summary-card">
              <h3 style={{ color: theme.primary }}>Your Check-in Summary</h3>
              <div className="insight-list">
                <div className="insight-item">
                  <span className="insight-emoji">💪</span>
                  <p>You've identified your key strengths in {field || 'your field'}</p>
                </div>
                <div className="insight-item">
                  <span className="insight-emoji">⏱️</span>
                  <p>You've prioritized how you spend your time on professional activities</p>
                </div>
                <div className="insight-item">
                  <span className="insight-emoji">💡</span>
                  <p>You've discovered motivation techniques used by successful professionals</p>
                </div>
                <div className="insight-item">
                  <span className="insight-emoji">🎯</span>
                  <p>You've set a clear focus for the week ahead</p>
                </div>
                <div className="insight-item">
                  <span className="insight-emoji">🔮</span>
                  <p>You've visualized your success for the future</p>
                </div>
              </div>
              <div className="quote-box" style={{ background: `linear-gradient(135deg, #f5f7fa, #e4e8f0)` }}>
                <p>"Comparison is the thief of joy, but self-awareness is the key to growth."</p>
              </div>
            </div>
            
            <div className="feature-preview">
              <h3>Unlock More Insights</h3>
              <div className="premium-features">
                <div className="premium-feature">
                  <span className="premium-feature-icon">📊</span>
                  <span>Progress Tracking</span>
                </div>
                <div className="premium-feature">
                  <span className="premium-feature-icon">📱</span>
                  <span>Daily Reminders</span>
                </div>
                <div className="premium-feature locked">
                  <span className="premium-feature-icon">🔒</span>
                  <span>AI Insights</span>
                </div>
              </div>
              <button className="premium-button">
                Try Premium Free
              </button>
            </div>
            
            <div className="action-buttons">
              <button 
                className="secondary-button"
                onClick={() => setCurrentScreen(0)}
                style={{ borderColor: theme.primary, color: theme.primary }}
              >
                Start Over
              </button>
              <button 
                className="cta-button share-button"
                onClick={() => alert("Sharing functionality would be implemented here")}
                style={{ background: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary})` }}
              >
                <span className="share-icon">↗</span>
                Share Insights
              </button>
            </div>
            
            <div className="next-session">
              <p>Next check-in recommended in 7 days</p>
              <button 
                className="reminder-button"
                onClick={() => alert("Reminder set for 7 days from now")}
                style={{ color: theme.primary }}
              >
                Set Reminder
              </button>
            </div>
          </div>
        );
    }
  };

  // Event listeners for strength selection counter
  useEffect(() => {
    const updateSelectedCount = () => {
      const countElement = document.getElementById('selected-count');
      const selectedItems = document.querySelectorAll('.strength-option.selected').length;
      if (countElement) countElement.textContent = selectedItems;
    };

    const options = document.querySelectorAll('.strength-option');
    options.forEach(option => {
      option.addEventListener('click', updateSelectedCount);
    });

    return () => {
      options.forEach(option => {
        option.removeEventListener('click', updateSelectedCount);
      });
    };
  }, [currentScreen === 4]);

  return (
    <div className="check-in-container">
      {renderProgressBar()}
      {renderScreen()}
    </div>
  );
};

export default CheckInFlow; 