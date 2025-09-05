'use client';
import Image from 'next/image';

const ThreeDImageRotator = () => {
  return (
    <div className="absolute top-10 left-1/2 transform -translate-x-1/2 z-20">
      <style jsx>{`
        @keyframes rotate3d {
          0% {
            transform: rotateY(0deg);
          }
          100% {
            transform: rotateY(360deg);
          }
        }
        
        .rotating-image {
          animation: rotate3d 7s infinite linear;
          transform-style: preserve-3d;
        }
        
        .image-container {
          perspective: 1000px;
          width: 192px;
          height: 192px;
        }
      `}</style>
      
      <div className="image-container">
        <div className="rotating-image">
          <Image 
            src="/Naser.png"
            alt="للوغو الرسمي" 
            width={192}
            height={192}
            className="rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

export default ThreeDImageRotator;