import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const Instagram = () => {
  // Sample stories data - in a real app, this would be fetched from an API
  const storiesData = [
    {
      id: 1,
      username: "john_doe",
      profilePic: "https://picsum.photos/50/50?random=1",
      stories: [
        "https://picsum.photos/400/700?random=10",
        "https://picsum.photos/400/700?random=11",
        "https://picsum.photos/400/700?random=12"
      ]
    },
    {
      id: 2,
      username: "jane_smith",
      profilePic: "https://picsum.photos/50/50?random=2",
      stories: [
        "https://picsum.photos/400/700?random=20",
        "https://picsum.photos/400/700?random=21"
      ]
    },
    {
      id: 3,
      username: "mike_wilson",
      profilePic: "https://picsum.photos/50/50?random=3",
      stories: [
        "https://picsum.photos/400/700?random=30",
        "https://picsum.photos/400/700?random=31",
        "https://picsum.photos/400/700?random=32",
        "https://picsum.photos/400/700?random=33"
      ]
    },
    {
      id: 4,
      username: "sarah_jones",
      profilePic: "https://picsum.photos/50/50?random=4",
      stories: [
        "https://picsum.photos/400/700?random=40",
        "https://picsum.photos/400/700?random=41"
      ]
    },
    {
      id: 5,
      username: "alex_brown",
      profilePic: "https://picsum.photos/50/50?random=5",
      stories: [
        "https://picsum.photos/400/700?random=50"
      ]
    }
  ];

  const [selectedUser, setSelectedUser] = useState(null);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const intervalRef = useRef(null);
  const progressIntervalRef = useRef(null);

  const STORY_DURATION = 5000; // 5 seconds

  const startStoryTimer = () => {
    // Clear existing intervals
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);

    setProgress(0);
    
    // Progress bar animation
    progressIntervalRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          return 100;
        }
        return prev + (100 / (STORY_DURATION / 100));
      });
    }, 100);

    // Auto advance to next story
    intervalRef.current = setTimeout(() => {
      nextStory();
    }, STORY_DURATION);
  };

  const stopStoryTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
  };

  const openStoryViewer = (userIndex, storyIndex = 0) => {
    setSelectedUser(userIndex);
    setCurrentStoryIndex(storyIndex);
    setIsLoading(true);
  };

  const closeStoryViewer = () => {
    stopStoryTimer();
    setSelectedUser(null);
    setCurrentStoryIndex(0);
    setProgress(0);
  };

  const nextStory = () => {
    const currentUser = storiesData[selectedUser];
    if (currentStoryIndex < currentUser.stories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
      setIsLoading(true);
    } else {
      // Move to next user's stories
      if (selectedUser < storiesData.length - 1) {
        setSelectedUser(prev => prev + 1);
        setCurrentStoryIndex(0);
        setIsLoading(true);
      } else {
        closeStoryViewer();
      }
    }
  };

  const prevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1);
      setIsLoading(true);
    } else if (selectedUser > 0) {
      // Move to previous user's stories
      const prevUserIndex = selectedUser - 1;
      setSelectedUser(prevUserIndex);
      setCurrentStoryIndex(storiesData[prevUserIndex].stories.length - 1);
      setIsLoading(true);
    }
  };

  const handleImageLoad = () => {
    setIsLoading(false);
    startStoryTimer();
  };

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    const screenWidth = window.innerWidth;
    const touchX = touch.clientX;
    
    if (touchX < screenWidth / 2) {
      stopStoryTimer();
      prevStory();
    } else {
      stopStoryTimer();
      nextStory();
    }
  };

  useEffect(() => {
    return () => {
      stopStoryTimer();
    };
  }, []);

  const styles = {
    container: {
      maxWidth: '400px',
      margin: '0 auto',
      backgroundColor: 'white',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    },
    storiesHeader: {
      padding: '16px'
    },
    title: {
      fontSize: '20px',
      fontWeight: 'bold',
      marginBottom: '16px',
      color: '#333'
    },
    storiesList: {
      display: 'flex',
      gap: '16px',
      overflowX: 'auto',
      paddingBottom: '8px'
    },
    storyItem: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      cursor: 'pointer',
      flexShrink: 0
    },
    profileRing: {
      width: '64px',
      height: '64px',
      borderRadius: '50%',
      background: 'linear-gradient(45deg, #f9a825, #e91e63)',
      padding: '2px',
      position: 'relative'
    },
    profilePic: {
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      objectFit: 'cover',
      border: '2px solid white'
    },
    username: {
      fontSize: '12px',
      marginTop: '4px',
      textAlign: 'center',
      maxWidth: '64px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      color: '#333'
    },
    storyViewer: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'black',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    progressContainer: {
      position: 'absolute',
      top: '16px',
      left: '16px',
      right: '16px',
      display: 'flex',
      gap: '4px',
      zIndex: 10
    },
    progressBar: {
      flex: 1,
      height: '2px',
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
      borderRadius: '1px'
    },
    progressFill: {
      height: '100%',
      backgroundColor: 'white',
      borderRadius: '1px',
      transition: 'width 0.1s linear'
    },
    header: {
      position: 'absolute',
      top: '32px',
      left: '16px',
      right: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      zIndex: 10
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    headerProfilePic: {
      width: '32px',
      height: '32px',
      borderRadius: '50%'
    },
    headerUsername: {
      color: 'white',
      fontWeight: '500'
    },
    closeButton: {
      color: 'white',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '4px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    storyImageContainer: {
      position: 'relative',
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    loadingSpinner: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '32px',
      height: '32px',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      borderTop: '2px solid white',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    },
    storyImage: {
      maxWidth: '100%',
      maxHeight: '100%',
      objectFit: 'contain'
    },
    navigationContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex'
    },
    navLeft: {
      width: '50%',
      height: '100%',
      cursor: 'pointer'
    },
    navRight: {
      width: '50%',
      height: '100%',
      cursor: 'pointer'
    },
    navButton: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      color: 'white',
      background: 'rgba(0, 0, 0, 0.5)',
      border: 'none',
      cursor: 'pointer',
      padding: '8px',
      borderRadius: '50%',
      opacity: 0,
      transition: 'opacity 0.3s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    navButtonLeft: {
      left: '16px'
    },
    navButtonRight: {
      right: '16px'
    }
  };

  // Add keyframes for spinner animation
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        0% { transform: translate(-50%, -50%) rotate(0deg); }
        100% { transform: translate(-50%, -50%) rotate(360deg); }
      }
      .nav-button:hover {
        opacity: 1 !important;
      }
      .story-viewer:hover .nav-button {
        opacity: 1;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div style={styles.container}>
      {/* Stories List */}
      <div style={styles.storiesHeader}>
        <h1 style={styles.title}>Stories</h1>
        <div style={styles.storiesList}>
          {storiesData.map((user, userIndex) => (
            <div
              key={user.id}
              style={styles.storyItem}
              onClick={() => openStoryViewer(userIndex)}
            >
              <div style={styles.profileRing}>
                <img
                  src={user.profilePic}
                  alt={user.username}
                  style={styles.profilePic}
                />
              </div>
              <span style={styles.username}>
                {user.username}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Story Viewer */}
      {selectedUser !== null && (
        <div style={styles.storyViewer} className="story-viewer">
          {/* Progress bars */}
          <div style={styles.progressContainer}>
            {storiesData[selectedUser].stories.map((_, index) => (
              <div key={index} style={styles.progressBar}>
                <div
                  style={{
                    ...styles.progressFill,
                    width: index < currentStoryIndex ? '100%' : 
                           index === currentStoryIndex ? `${progress}%` : '0%'
                  }}
                />
              </div>
            ))}
          </div>

          {/* Header */}
          <div style={styles.header}>
            <div style={styles.userInfo}>
              <img
                src={storiesData[selectedUser].profilePic}
                alt={storiesData[selectedUser].username}
                style={styles.headerProfilePic}
              />
              <span style={styles.headerUsername}>
                {storiesData[selectedUser].username}
              </span>
            </div>
            <button
              onClick={closeStoryViewer}
              style={{...styles.closeButton, ':hover': {backgroundColor: 'rgba(255, 255, 255, 0.2)'}}}
            >
              <X size={24} />
            </button>
          </div>

          {/* Story Image */}
          <div style={styles.storyImageContainer}>
            {isLoading && (
              <div style={styles.loadingSpinner} />
            )}
            
            <img
              src={storiesData[selectedUser].stories[currentStoryIndex]}
              alt="Story"
              style={styles.storyImage}
              onLoad={handleImageLoad}
              onTouchStart={handleTouchStart}
            />

            {/* Navigation areas (invisible but clickable) */}
            <div style={styles.navigationContainer}>
              <div
                style={styles.navLeft}
                onClick={() => {
                  stopStoryTimer();
                  prevStory();
                }}
              />
              <div
                style={styles.navRight}
                onClick={() => {
                  stopStoryTimer();
                  nextStory();
                }}
              />
            </div>
          </div>

          {/* Navigation buttons (visible on hover for desktop testing) */}
          <button
            onClick={() => {
              stopStoryTimer();
              prevStory();
            }}
            style={{...styles.navButton, ...styles.navButtonLeft}}
            className="nav-button"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={() => {
              stopStoryTimer();
              nextStory();
            }}
            style={{...styles.navButton, ...styles.navButtonRight}}
            className="nav-button"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Instagram
