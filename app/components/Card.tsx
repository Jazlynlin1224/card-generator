'use client';

import React, { forwardRef, useEffect, useState } from 'react';
import styles from './Card.module.css';

interface CardProps {
  imageUrl: string;
  title: string;
  subtitle?: string;
  backgroundColor?: string;
  filter?: string;
  titleSize?: number;
  subtitleSize?: number;
  rotation?: number;
  borderStyle?: string;
  location?: string;
  texture?: string;
  mood?: string;
  timestamp?: string;
  season?: 'spring' | 'summer' | 'autumn' | 'winter';
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ 
    imageUrl, 
    title, 
    subtitle, 
    backgroundColor = '#2c2c2c',
    filter = 'none',
    titleSize = 1.8,
    subtitleSize = 1.2,
    rotation = -1,
    borderStyle = 'polaroid',
    location,
    texture = 'vintage',
    mood,
    season,
    timestamp = new Date().toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }, ref) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [showFlash, setShowFlash] = useState(false);

    useEffect(() => {
      if (imageUrl) {
        setShowFlash(true);
        const timer = setTimeout(() => setShowFlash(false), 500);
        return () => clearTimeout(timer);
      }
    }, [imageUrl]);

    const handleImageLoad = () => {
      setIsLoaded(true);
    };

    return (
      <div 
        className={`${styles.card} ${styles[`texture-${texture}`]}`} 
        ref={ref}
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <div className={`${styles[`border-${borderStyle}`]} ${season ? styles[season] : ''}`}>
          <div className={styles.imageContainer}>
            {imageUrl && (
              <>
                <img
                  src={imageUrl}
                  alt={title}
                  className={`${styles.image} ${isLoaded ? styles.loaded : ''}`}
                  style={{ filter }}
                  onLoad={handleImageLoad}
                />
                <div className={`${styles.flashOverlay} ${showFlash ? styles.flash : ''}`} />
              </>
            )}
            {!imageUrl && (
              <div className={styles.placeholderImage}>
                点击上传照片
              </div>
            )}
            {mood && (
              <div className={styles.moodTag}>
                <span className={`${styles.moodIcon} ${styles.heartbeat}`}>
                  {getMoodIcon(mood)}
                </span>
                {mood}
              </div>
            )}
            {location && (
              <div className={styles.locationTag}>
                <span className={styles.locationIcon}>📍</span>
                {location}
              </div>
            )}
          </div>
          <div className={styles.content}>
            <h2 className={`${styles.title} ${isLoaded ? styles.writing : ''}`} style={{ fontSize: `${titleSize}rem` }}>
              {title}
            </h2>
            {subtitle && (
              <p className={`${styles.subtitle} ${isLoaded ? styles.writing : ''}`} style={{ fontSize: `${subtitleSize}rem` }}>
                {subtitle}
              </p>
            )}
            <div className={styles.dateStamp}>{timestamp}</div>
            <div className={styles.watermark}>Sharing Moments</div>
          </div>
        </div>
        {season && <div className={`${styles.seasonalDecoration} ${styles[season]}`} />}
      </div>
    );
  }
);

// 根据心情返回对应的表情符号
const getMoodIcon = (mood: string) => {
  const moodIcons: { [key: string]: string } = {
    '开心': '😊',
    '感动': '🥺',
    '思念': '💭',
    '期待': '✨',
    '放松': '😌',
    '兴奋': '🥳',
    '温暖': '🌟',
    '感恩': '🙏',
  };
  return moodIcons[mood] || '💝';
};

Card.displayName = 'Card';

export default Card; 