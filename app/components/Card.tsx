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
    backgroundColor = '#ffffff',
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
      minute: '2-digit',
      hour12: false
    }).replace(/年|月/g, '.').replace('日', '')
  }, ref) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [showFlash, setShowFlash] = useState(false);

    // 为每个字符生成随机旋转角度
    const getRandomRotation = () => {
      return Math.random() * 2 - 1;
    };

    // 处理背景颜色和渐变
    const getBackgroundStyle = () => {
      const style: Record<string, any> = {
        transform: `rotate(${rotation}deg)`,
      };

      if (backgroundColor.startsWith('gradient-')) {
        style.className = `${styles[backgroundColor]}`;  // 使用预定义的渐变类
      } else {
        style.backgroundColor = backgroundColor;
      }

      return style;
    };

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
        className={`${styles.card} ${styles[`border-${borderStyle}`]} ${styles[`texture-${texture}`]} ${season ? styles[season] : ''} ${backgroundColor.startsWith('gradient-') ? styles[backgroundColor] : ''}`}
        ref={ref}
        style={getBackgroundStyle() as React.CSSProperties}
      >
        <div className={styles.cardInner}>
          <div className={styles.imageContainer}>
            {imageUrl && (
              <>
                <img
                  src={imageUrl}
                  alt={title}
                  className={`${styles.image} ${isLoaded ? styles.loaded : ''}`}
                  style={{ filter }}
                  onLoad={handleImageLoad}
                  crossOrigin="anonymous"
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