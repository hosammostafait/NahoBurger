
import React from 'react';

interface HowToPlayScreenProps {
  onBack: () => void;
}

const HowToPlayScreen: React.FC<HowToPlayScreenProps> = ({ onBack }) => {
  const instructions = [
    {
      title: "افتح الأدراج",
      desc: "رحلتك تتكون من 10 محطات، كل محطة مخبأة داخل درج سحري. تعلم القاعدة النحوية أولاً ثم ابدأ التحدي.",
      icon: "🗝️",
      color: "bg-blue-50 text-blue-600 border-blue-100"
    },
    {
      title: "اجمع المكونات",
      desc: "كلما حللت الأسئلة بشكل صحيح، تكسب مكوناً جديداً (خبز، لحم، جبن، إلخ) لبناء الهامبورجر الخطير الخاص بك.",
      icon: "🍔",
      color: "bg-orange-50 text-orange-600 border-orange-100"
    },
    {
      title: "ألعاب جانبية",
      desc: "بين المحطات، ستواجه ألعاباً ممتعة مثل 'لعبة الذاكرة' و'كلمة السر' لتنشيط عقلك وجمع المزيد من النقاط.",
      icon: "🎮",
      color: "bg-purple-50 text-purple-600 border-purple-100"
    },
    {
      title: "مساعدة ذكية",
      desc: "هل تواجه صعوبة؟ اضغط على أيقونة السماعة ليقرأ لك الذكاء الاصطناعي السؤال والخيارات بوضوح.",
      icon: "🔊",
      color: "bg-green-50 text-green-600 border-green-100"
    },
    {
      title: "لوحة الشرف",
      desc: "نافس أصدقاءك في النحو! كلما زادت نقاطك، ارتفع ترتيبك في قائمة أمهر طباخي النحو في العالم.",
      icon: "🏆",
      color: "bg-yellow-50 text-yellow-600 border-yellow-100"
    }
  ];

  return (
    <div className="flex-1 flex flex-col bg-white overflow-y-auto pb-10">
      <div className="p-6 border-b border-orange-100 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-md z-10">
        <button onClick={onBack} className="text-2xl hover:scale-110 transition-transform">🔙</button>
        <h2 className="text-2xl font-black text-slate-800">كيفية اللعب؟ 📖</h2>
        <div className="w-8"></div>
      </div>

      <div className="p-6 space-y-6">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-bounce">🥪</div>
          <p className="text-slate-500 font-bold leading-relaxed">
            مهمتك هي أن تصبح "شيف النحو العالمي" من خلال إتقان قواعد اللغة العربية وبناء أضخم ساندويتش هامبورجر!
          </p>
        </div>

        <div className="space-y-4">
          {instructions.map((item, index) => (
            <div 
              key={index} 
              className={`flex gap-4 p-5 rounded-[30px] border-2 transition-all hover:shadow-md animate-in slide-in-from-bottom-4 ${item.color}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-4xl flex-shrink-0 flex items-center justify-center">
                {item.icon}
              </div>
              <div>
                <h3 className="text-lg font-black mb-1">{item.title}</h3>
                <p className="text-sm font-bold opacity-80 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-slate-900 text-white p-8 rounded-[40px] mt-8 relative overflow-hidden shadow-xl">
          <div className="absolute -right-4 -bottom-4 text-7xl opacity-20 rotate-12">🔥</div>
          <h3 className="text-xl font-black mb-3">نصيحة الشيف:</h3>
          <p className="text-slate-300 font-bold text-sm leading-relaxed">
            اقرأ "وصفة النجاح" في بداية كل محطة بعناية، فهي تحتوي على الأسرار التي ستمكنك من حل جميع الأسئلة دون أخطاء!
          </p>
        </div>

        <button
          onClick={onBack}
          className="w-full py-5 bg-orange-500 text-white font-black text-2xl rounded-3xl shadow-xl hover:bg-orange-600 active:scale-95 transition-all mt-6"
        >
          فهمت! لنبدأ 🚀
        </button>
      </div>
    </div>
  );
};

export default HowToPlayScreen;
