'use client';

import React, { useState, useCallback, useRef } from 'react';
import { toPng } from 'html-to-image';
import styles from './CardCustomizer.module.css';
import Card from './Card';

const FILTERS = {
  'none': '无滤镜',
  'grayscale(100%)': '黑白',
  'sepia(100%)': '复古',
  'brightness(120%) contrast(110%)': '明亮',
  'blur(1px)': '模糊',
  'hue-rotate(90deg)': '色调转换',
  'contrast(110%) brightness(110%) sepia(30%)': '温暖',
  'saturate(150%) contrast(105%)': '鲜艳',
  'invert(10%) sepia(20%) saturate(120%)': '电影感',
  'contrast(95%) brightness(95%) sepia(20%) saturate(110%)': '胶片',
  'grayscale(80%) sepia(20%) contrast(120%)': '复古黑白',
  'brightness(110%) contrast(110%) saturate(130%) hue-rotate(350deg)': '日落',
  'contrast(120%) brightness(110%) saturate(130%) sepia(30%) hue-rotate(350deg)': '金色年华',
  'grayscale(50%) brightness(110%) contrast(110%) sepia(20%)': '怀旧时光',
  'brightness(105%) contrast(105%) saturate(120%) hue-rotate(10deg)': '暖阳',
  'brightness(95%) contrast(120%) saturate(110%) hue-rotate(180deg)': '清凉夏日',
  'grayscale(30%) brightness(105%) contrast(110%) sepia(30%)': '复古明信片',
  'brightness(105%) contrast(110%) saturate(120%) hue-rotate(330deg)': '粉色回忆',
  'contrast(130%) brightness(90%) saturate(110%) hue-rotate(20deg)': '深邃暮色',
  'grayscale(20%) brightness(105%) contrast(110%) sepia(10%)': '轻复古',
  'brightness(105%) contrast(105%) saturate(110%) hue-rotate(350deg) sepia(20%)': '浪漫时光',
  'brightness(108%) contrast(108%) saturate(115%) hue-rotate(355deg)': '甜蜜回忆',
  'brightness(102%) contrast(105%) saturate(120%) hue-rotate(345deg)': '温柔时刻',
};

const COLORS = {
  // 高级渐变系列
  'gradient-champagne': '香槟金',
  'gradient-rose-gold': '玫瑰金',
  'gradient-platinum': '铂金光泽',
  'gradient-silk': '丝绸光感',
  'gradient-pearl': '珍珠光泽',
  'gradient-velvet': '丝绒暮光',
  'gradient-crystal': '水晶光芒',
  'gradient-porcelain': '青瓷韵味',
  'gradient-cashmere': '羊绒暖阳',
  'gradient-marble': '大理石纹',
  
  // 艺术渐变系列
  'gradient-monet': '莫奈花园',
  'gradient-vangogh': '星夜漩涡',
  'gradient-picasso': '毕加索蓝',
  'gradient-matisse': '马蒂斯红',
  'gradient-klimt': '克里姆特金',
  
  // 自然高级渐变
  'gradient-aurora': '极光之夜',
  'gradient-sakura': '樱花飞舞',
  'gradient-twilight': '暮色时分',
  'gradient-misty-forest': '雾林晨曦',
  'gradient-desert-dusk': '沙漠黄昏',
  'gradient-autumn-whisper': '秋日私语',
  'gradient-morning-dew': '晨露微光',
  'gradient-spring-melody': '春之韵律',
  'gradient-moonlight': '月光倾城',
  'gradient-golden-hour': '黄金时刻',
  
  // 时尚渐变系列
  'gradient-chanel': '香奈儿米',
  'gradient-dior': '迪奥灰',
  'gradient-hermes': '爱马仕橙',
  'gradient-tiffany': '蒂芙尼蓝',
  'gradient-cartier': '卡地亚红',
  
  // 高级纯色系列
  '#f8f5f0': '羊皮纸白',
  '#f4f0e6': '象牙奶茶',
  '#e8e0d5': '麂皮绒棕',
  '#e6e2d3': '亚麻灰',
  '#e2d9c9': '卡其米',
};

const GRADIENTS = {
  'gradient-pink': '粉红渐变',
  'gradient-ocean': '海洋渐变',
  'gradient-sunset': '日落渐变',
  'gradient-morning': '清晨渐变',
  'gradient-dream': '梦幻渐变',
};

// 季节主题配色
const SEASON_COLORS = {
  spring: {
    background: 'linear-gradient(135deg, #fff5f5 0%, #f0fff4 100%)',
    text: '#ff9a9e'
  },
  summer: {
    background: 'linear-gradient(135deg, #f0f9ff 0%, #fff9e6 100%)',
    text: '#4facfe'
  },
  autumn: {
    background: 'linear-gradient(135deg, #fff4e6 0%, #fff9e6 100%)',
    text: '#ffa07a'
  },
  winter: {
    background: 'linear-gradient(135deg, #f5f5f5 0%, #f0f9ff 100%)',
    text: '#a1c4fd'
  }
};

const ROTATIONS = {
  '-2': '向左倾斜',
  '-1': '微左倾',
  '0': '正向',
  '1': '微右倾',
  '2': '向右倾斜',
};

const BORDER_STYLES = {
  'classic': '经典简约',
  'thick': '厚边框',
  'vintage': '复古风',
  'modern': '现代感',
  'elegant': '优雅格调',
  'artistic': '艺术几何',
  'film': '胶片风',
  'polaroid': '拍立得',
  'watercolor': '水彩画框',
  'romantic': '浪漫风格',
  'storybook': '故事书',
  'notebook': '笔记本',
  'postcard': '明信片',
  'instant': '即影即有',
  'gallery': '画廊',
  'journal': '日记本',
};

const TEXTURES = {
  'none': '无纹理',
  'paper': '纸张',
  'canvas': '画布',
  'grain': '颗粒',
  'vintage-paper': '复古纸张',
  'watercolor-paper': '水彩纸',
  'kraft': '牛皮纸',
  'linen': '亚麻布',
  'parchment': '羊皮纸',
  'romantic': '浪漫纸张',
};

const MOODS = {
  '开心': '分享快乐时光',
  '感动': '记录感动瞬间',
  '思念': '思念某个人',
  '期待': '充满期待',
  '放松': '享受当下',
  '兴奋': '激动人心',
  '温暖': '温暖时刻',
  '感恩': '心怀感激',
  '浪漫': '浪漫时刻',
  '甜蜜': '甜蜜瞬间',
  '幸福': '幸福时光',
  '憧憬': '美好憧憬',
};

const CardCustomizer: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [subtitle, setSubtitle] = useState<string>('');
  const [backgroundColor, setBackgroundColor] = useState<string>('#ffffff');
  const [filter, setFilter] = useState<string>('none');
  const [titleSize, setTitleSize] = useState<number>(1.5);
  const [subtitleSize, setSubtitleSize] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(-1);
  const [borderStyle, setBorderStyle] = useState<string>('classic');
  const [texture, setTexture] = useState<string>('none');
  const [mood, setMood] = useState<string>('开心');
  const [location, setLocation] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsLoading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleSaveAsImage = useCallback(async () => {
    if (cardRef.current === null) return;
    setIsLoading(true);

    try {
      // 临时移除旋转，以确保完整捕获
      const originalTransform = cardRef.current.style.transform;
      cardRef.current.style.transform = 'none';

      // 获取元素的完整尺寸，包括任何溢出的部分
      const box = cardRef.current.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(cardRef.current);
      const margin = {
        left: parseInt(computedStyle.marginLeft),
        right: parseInt(computedStyle.marginRight),
        top: parseInt(computedStyle.marginTop),
        bottom: parseInt(computedStyle.marginBottom)
      };

      // 计算完整的尺寸
      const fullWidth = box.width + margin.left + margin.right;
      const fullHeight = box.height + margin.top + margin.bottom;

      // 添加额外的padding以确保捕获阴影和边框效果
      const padding = 40;
      
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        width: fullWidth + padding * 2,
        height: fullHeight + padding * 2,
        pixelRatio: 2,
        style: {
          transform: 'none',
          margin: `${padding}px`,
          width: `${fullWidth}px`,
          height: `${fullHeight}px`,
          boxSizing: 'content-box'
        },
        quality: 0.95
      });

      // 恢复原始旋转
      cardRef.current.style.transform = originalTransform;
      
      const link = document.createElement('a');
      link.download = `${title || 'polaroid'}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('保存图片失败:', err);
    } finally {
      setIsLoading(false);
    }
  }, [title]);

  const handleExportConfig = useCallback(() => {
    const config = {
      imageUrl,
      title,
      subtitle,
      backgroundColor,
      filter,
      titleSize,
      subtitleSize,
      rotation,
      borderStyle,
      texture,
      exportDate: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(config, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.download = `${title || 'polaroid'}-config.json`;
    link.href = url;
    link.click();
    
    URL.revokeObjectURL(url);
  }, [imageUrl, title, subtitle, backgroundColor, filter, titleSize, subtitleSize, rotation, borderStyle, texture]);

  const handleColorChange = (value: string) => {
    setBackgroundColor(value);
  };

  return (
    <div className={styles.container}>
      <div className={styles.customizer}>
        <h2 className={styles.title}>分享你的瞬间</h2>
        
        <div className={styles.inputGroup}>
          <label htmlFor="image">选择照片:</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageUpload}
            className={styles.fileInput}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="title">标题:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="写下这一刻的标题..."
            className={styles.textInput}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="subtitle">描述:</label>
          <textarea
            id="subtitle"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="记录下此刻的感受..."
            className={styles.textArea}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="backgroundColor">卡片颜色:</label>
          <select
            id="backgroundColor"
            value={backgroundColor}
            onChange={(e) => handleColorChange(e.target.value)}
            className={styles.select}
          >
            <optgroup label="纯色">
              {Object.entries(COLORS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </optgroup>
            <optgroup label="渐变">
              {Object.entries(GRADIENTS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </optgroup>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="filter">滤镜风格:</label>
          <select
            id="filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className={styles.select}
          >
            {Object.entries(FILTERS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="rotation">卡片角度:</label>
          <select
            id="rotation"
            value={rotation}
            onChange={(e) => setRotation(Number(e.target.value))}
            className={styles.select}
          >
            {Object.entries(ROTATIONS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="titleSize">标题大小: {titleSize}rem</label>
          <input
            type="range"
            id="titleSize"
            min="1"
            max="2.5"
            step="0.1"
            value={titleSize}
            onChange={(e) => setTitleSize(Number(e.target.value))}
            className={styles.rangeInput}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="subtitleSize">描述大小: {subtitleSize}rem</label>
          <input
            type="range"
            id="subtitleSize"
            min="0.8"
            max="1.5"
            step="0.1"
            value={subtitleSize}
            onChange={(e) => setSubtitleSize(Number(e.target.value))}
            className={styles.rangeInput}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="borderStyle">边框样式:</label>
          <select
            id="borderStyle"
            value={borderStyle}
            onChange={(e) => setBorderStyle(e.target.value)}
            className={styles.select}
          >
            {Object.entries(BORDER_STYLES).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="texture">纹理效果:</label>
          <select
            id="texture"
            value={texture}
            onChange={(e) => setTexture(e.target.value)}
            className={styles.select}
          >
            {Object.entries(TEXTURES).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="mood">此刻心情:</label>
          <select
            id="mood"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className={styles.select}
          >
            {Object.entries(MOODS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="location">所在位置:</label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="在哪里拍摄的呢？"
            className={styles.textInput}
          />
        </div>

        <div className={styles.buttonGroup}>
          <button
            onClick={handleSaveAsImage}
            className={styles.button}
            disabled={isLoading}
          >
            {isLoading ? '保存中...' : '保存照片'}
          </button>
          <button
            onClick={handleExportConfig}
            className={styles.button}
            disabled={isLoading}
          >
            导出配置
          </button>
        </div>
      </div>
      
      <div className={styles.preview}>
        <h3 className={styles.previewTitle}>预览</h3>
        <Card
          ref={cardRef}
          imageUrl={imageUrl}
          title={title || '写下你的标题'}
          subtitle={subtitle}
          backgroundColor={backgroundColor}
          filter={filter}
          titleSize={titleSize}
          subtitleSize={subtitleSize}
          rotation={rotation}
          borderStyle={borderStyle}
          texture={texture}
          mood={mood}
          location={location}
        />
      </div>
    </div>
  );
};

export default CardCustomizer; 