import React, { useState, useEffect } from 'react';
import { RgbColorPicker, RgbColor } from 'react-colorful';
import { FaUser, FaGraduationCap, FaSchool, FaUniversity, FaBook, FaBookOpen, 
  FaUserGraduate, FaChalkboardTeacher, FaAtom, FaFlask, FaCalculator, 
  FaPencilAlt, FaMicroscope, FaMusic, FaPaintBrush, FaGlobe, 
  FaHistory, FaLanguage, FaBrain, FaRunning, FaChess, FaCamera, FaRobot, 
  FaSeedling, FaChartLine, FaPalette, FaCode, FaFootballBall, FaTimes,
  FaHeartbeat, FaPills, FaClinicMedical, FaDna, FaStethoscope, FaSyringe,
  FaBone, FaEye, FaTeeth, FaAllergies, FaWeightHanging, FaDumbbell,
  FaBasketballBall, FaTableTennis, FaSwimmingPool, FaBiking,
  FaCarrot, FaAppleAlt, FaHamburger, FaPizzaSlice, FaIceCream,
  FaLightbulb, FaSatellite, FaRocket, FaWind, FaSolarPanel
} from 'react-icons/fa';

interface IconPickerProps {
  onIconChange: (iconName: string, color: string, bgColor: string) => void;
  initialIcon?: string;
  initialColor?: string;
  initialBgColor?: string;
}

const icons = [
  { name: "user", icon: <FaUser /> },
  { name: "graduation", icon: <FaGraduationCap /> },
  { name: "school", icon: <FaSchool /> },
  { name: "university", icon: <FaUniversity /> },
  { name: "book", icon: <FaBook /> },
  { name: "open-book", icon: <FaBookOpen /> },
  { name: "graduate", icon: <FaUserGraduate /> },
  { name: "teacher", icon: <FaChalkboardTeacher /> },
  { name: "atom", icon: <FaAtom /> },
  { name: "flask", icon: <FaFlask /> },
  { name: "calculator", icon: <FaCalculator /> },
  { name: "microscope", icon: <FaMicroscope /> },
  { name: "dna", icon: <FaDna /> },
  { name: "lightbulb", icon: <FaLightbulb /> },
  { name: "satellite", icon: <FaSatellite /> },
  { name: "rocket", icon: <FaRocket /> },
  { name: "wind", icon: <FaWind /> },
  { name: "solar-panel", icon: <FaSolarPanel /> },
  { name: "stethoscope", icon: <FaStethoscope /> },
  { name: "heartbeat", icon: <FaHeartbeat /> },
  { name: "pills", icon: <FaPills /> },
  { name: "clinic", icon: <FaClinicMedical /> },
  { name: "syringe", icon: <FaSyringe /> },
  { name: "bone", icon: <FaBone /> },
  { name: "eye", icon: <FaEye /> },
  { name: "teeth", icon: <FaTeeth /> },
  { name: "allergies", icon: <FaAllergies /> },
  { name: "weight", icon: <FaWeightHanging /> },
  { name: "dumbbell", icon: <FaDumbbell /> },
  { name: "basketball", icon: <FaBasketballBall /> },
  { name: "table-tennis", icon: <FaTableTennis /> },
  { name: "swimming", icon: <FaSwimmingPool /> },
  { name: "running", icon: <FaRunning /> },
  { name: "biking", icon: <FaBiking /> },
  { name: "football", icon: <FaFootballBall /> },
  { name: "carrot", icon: <FaCarrot /> },
  { name: "apple", icon: <FaAppleAlt /> },
  { name: "hamburger", icon: <FaHamburger /> },
  { name: "pizza", icon: <FaPizzaSlice /> },
  { name: "ice-cream", icon: <FaIceCream /> },
  { name: "music", icon: <FaMusic /> },
  { name: "paint", icon: <FaPaintBrush /> },
  { name: "palette", icon: <FaPalette /> },
  { name: "camera", icon: <FaCamera /> },
  { name: "code", icon: <FaCode /> },
  { name: "robot", icon: <FaRobot /> },
  { name: "globe", icon: <FaGlobe /> },
  { name: "history", icon: <FaHistory /> },
  { name: "language", icon: <FaLanguage /> },
  { name: "brain", icon: <FaBrain /> },
  { name: "chess", icon: <FaChess /> },
  { name: "seedling", icon: <FaSeedling /> },
  { name: "chart", icon: <FaChartLine /> }
];

// دالة لتحويل RGB إلى HEX
const rgbToHex = (r: number, g: number, b: number): string => {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};

// دالة لتحويل HEX إلى RGB
const hexToRgb = (hex: string): RgbColor => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
};

const IconPicker: React.FC<IconPickerProps> = ({ 
  onIconChange, 
  initialIcon = 'graduation', 
  initialColor = '#4a5568', 
  initialBgColor = '#ffffff' 
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(initialIcon);
  const [iconColor, setIconColor] = useState(initialColor);
  const [bgColor, setBgColor] = useState(initialBgColor);
  const [currentPicker, setCurrentPicker] = useState<'icon' | 'background'>('icon');
  const [iconRgb, setIconRgb] = useState<RgbColor>(hexToRgb(initialColor));
  const [bgRgb, setBgRgb] = useState<RgbColor>(hexToRgb(initialBgColor));

  useEffect(() => {
    setSelectedIcon(initialIcon);
    setIconColor(initialColor);
    setBgColor(initialBgColor);
    setIconRgb(hexToRgb(initialColor));
    setBgRgb(hexToRgb(initialBgColor));
  }, [initialIcon, initialColor, initialBgColor]);

  const getCurrentIcon = () => {
    const found = icons.find(icon => icon.name === selectedIcon);
    return found ? found.icon : <FaUser />;
  };

  const handleIconSelect = (iconName: string) => {
    setSelectedIcon(iconName);
  };

  const handleIconColorChange = (color: RgbColor) => {
    setIconRgb(color);
    setIconColor(rgbToHex(color.r, color.g, color.b));
  };

  const handleBgColorChange = (color: RgbColor) => {
    setBgRgb(color);
    setBgColor(rgbToHex(color.r, color.g, color.b));
  };

  const handleSave = () => {
    onIconChange(selectedIcon, iconColor, bgColor);
    setShowPicker(false);
  };

  return (
    <div className="relative flex justify-center">
      <div 
        className="relative w-20 h-20 md:w-24 md:h-24 rounded-full shadow-lg flex items-center justify-center border-4 border-white cursor-pointer transition-transform hover:scale-105"
        style={{ backgroundColor: bgColor }}
        onClick={() => setShowPicker(!showPicker)}
      >
        {React.cloneElement(getCurrentIcon() as React.ReactElement, { 
          className: 'text-3xl md:text-4xl',
          style: { color: iconColor } 
        })}
        <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md">
          <FaPencilAlt className="text-gray-600 text-xs" />
        </div>
      </div>

      {showPicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-5 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">اختر أيقونتك</h3>
              <button onClick={() => setShowPicker(false)} className="text-gray-500 hover:text-gray-700">
                <FaTimes />
              </button>
            </div>

            <div className="mb-6 grid grid-cols-5 gap-3">
              {icons.map((item) => (
                <div 
                  key={item.name}
                  className={`flex flex-col items-center p-2 rounded-lg cursor-pointer transition-all ${
                    selectedIcon === item.name ? 'bg-blue-100 border border-blue-200' : 'hover:bg-gray-100'
                  }`}
                  onClick={() => handleIconSelect(item.name)}
                >
                  {React.cloneElement(item.icon, { 
                    className: `text-2xl ${selectedIcon === item.name ? 'text-blue-600' : 'text-gray-600'}`,
                    style: { color: selectedIcon === item.name ? iconColor : undefined }
                  })}
                </div>
              ))}
            </div>
            
            <div className="space-y-6">
              <div className="flex flex-col items-center">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-2 border border-gray-200 shadow-md"
                  style={{ backgroundColor: bgColor }}
                >
                  {React.cloneElement(getCurrentIcon() as React.ReactElement, { 
                    className: 'text-2xl',
                    style: { color: iconColor } 
                  })}
                </div>
                <span className="text-sm text-gray-600">معاينة الأيقونة</span>
              </div>

              <div className="space-y-4">
                <div className="flex justify-center space-x-4">
                  <button
                    className={`px-4 py-2 rounded-lg transition-colors ${currentPicker === 'icon' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                    onClick={() => setCurrentPicker('icon')}
                  >
                    لون الأيقونة
                  </button>
                  <button
                    className={`px-4 py-2 rounded-lg transition-colors ${currentPicker === 'background' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                    onClick={() => setCurrentPicker('background')}
                  >
                    لون الخلفية
                  </button>
                </div>

                <div className="flex justify-center">
                  {currentPicker === 'icon' ? (
                    <RgbColorPicker color={iconRgb} onChange={handleIconColorChange} className="max-w-full" />
                  ) : (
                    <RgbColorPicker color={bgRgb} onChange={handleBgColorChange} className="max-w-full" />
                  )}
                </div>

                <div className="flex justify-center items-center space-x-4">
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded border border-gray-300 mr-2" style={{ backgroundColor: iconColor }}></div>
                    <span className="text-sm text-gray-700">{iconColor}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded border border-gray-300 mr-2" style={{ backgroundColor: bgColor }}></div>
                    <span className="text-sm text-gray-700">{bgColor}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                حفظ التغييرات
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IconPicker;
