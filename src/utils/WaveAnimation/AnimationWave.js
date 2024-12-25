import React from 'react';
import './waveAnimation.css';

const AnimationWave = () => {
  return (
    <div className="wave-container">
    <svg className="wave" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path fill="#4facfe" d="M0,128L30,144C60,160,120,192,180,186.7C240,181,300,139,360,112C420,85,480,75,540,90.7C600,107,660,149,720,170.7C780,192,840,192,900,170.7C960,149,1020,107,1080,90.7C1140,75,1200,85,1260,112C1320,139,1380,181,1410,202.7L1440,224L1440,320L0,320Z" />
    </svg>
    <svg className="wave" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path fill="#00f2fe" d="M0,224L30,224C60,224,120,224,180,218.7C240,213,300,203,360,186.7C420,171,480,149,540,133.3C600,117,660,107,720,128C780,149,840,213,900,224C960,235,1020,181,1080,160C1140,139,1200,149,1260,170.7C1320,192,1380,224,1410,240L1440,256L0,256Z" />
    </svg>
    
</div>
  )
}

export default AnimationWave