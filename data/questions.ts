
import { Station, Question } from '../types';

// دالة مساعدة لإنشاء محطات مكملة بأسئلة هادفة في حال لم يتم تخصيصها بالكامل
const createQuestionsForTopic = (topic: string, level: string, startId: number = 1): Question[] => {
  const diffPrefix = level === 'ADVANCED' ? 'متقدم: ' : level === 'INTERMEDIATE' ? 'متوسط: ' : 'بسيط: ';
  
  // Real grammar content mapping
  const contentMap: Record<string, Question[]> = {
    "المفعول به": [
      { id: 1, text: "أين المفعول به في 'شرح المعلم الدرسَ'؟", options: ["المعلم", "الدرسَ", "شرح", "مستتر"], correctAnswer: 1, explanation: "الدرس هو من وقع عليه فعل الشرح." },
      { id: 2, text: "المفعول به يكون دائماً:", options: ["مرفوعاً", "منصوباً", "مجروراً", "ساكناً"], correctAnswer: 1, explanation: "المفعول به من المنصوبات." },
      { id: 3, text: "علامة نصب المفعول به المفرد هي:", options: ["الضمة", "الفتحة", "الكسرة", "السكون"], correctAnswer: 1, explanation: "الفتحة للمفرد." },
      { id: 4, text: "أكمل: 'ركب الفارس ...'", options: ["الحصانُ", "الحصانِ", "الحصانَ", "حصانٌ"], correctAnswer: 2, explanation: "الحصان مفعول به منصوب." },
      { id: 5, text: "في 'يقرأ محمد القصص'، المفعول به هو:", options: ["محمد", "القصص", "يقرأ", "مستتر"], correctAnswer: 1, explanation: "القصص مفعول به." },
      { id: 6, text: "هل يأتي المفعول به في كل جملة فعلية؟", options: ["نعم", "لا", "فقط مع الأسماء", "فقط في الماضي"], correctAnswer: 1, explanation: "الأفعال اللازمة لا تأخذ مفعولاً به." },
      { id: 7, text: "المفعول به في 'رأيتك' هو:", options: ["التاء", "الكاف", "رأى", "أنا"], correctAnswer: 1, explanation: "كاف الخطاب في محل نصب مفعول به." },
      { id: 8, text: "أكمل: 'اشترى أبي ... جديدة'", options: ["سيارةٌ", "سيارةَ", "سيارةٍ", "سيارةً"], correctAnswer: 3, explanation: "سيارةً مفعول به منصوب." },
      { id: 9, text: "ما إعراب 'الخير' في 'افعل الخير'؟", options: ["فاعل", "مبتدأ", "مفعول به", "خبر"], correctAnswer: 2, explanation: "مفعول به منصوب." },
      { id: 10, text: "الفاعل في 'أكلت التفاحة' هو:", options: ["التفاحة", "التاء", "أنا", "مستتر"], correctAnswer: 1, explanation: "تاء الفاعل." }
    ],
    "حروف الجر": [
      { id: 1, text: "أي من الكلمات التالية حرف جر؟", options: ["في", "عن", "من", "كل ما سبق"], correctAnswer: 3, explanation: "في وعن ومن كلها حروف جر." },
      { id: 2, text: "الاسم بعد حرف الجر يكون:", options: ["مرفوعاً", "منصوباً", "مجروراً", "ساكناً"], correctAnswer: 2, explanation: "يسمى اسماً مجروراً." },
      { id: 3, text: "علامة جر الاسم المفرد هي:", options: ["الفتحة", "الكسرة", "الضمة", "السكون"], correctAnswer: 1, explanation: "الكسرة للمفرد." },
      { id: 4, text: "أكمل: 'الكتاب ... المكتب'", options: ["على", "في", "عن", "إلى"], correctAnswer: 0, explanation: "على المكتب (فوقه)." },
      { id: 5, text: "ما حرف الجر في 'ذهبت إلى المدرسة'؟", options: ["ذهبت", "إلى", "المدرسة", "التاء"], correctAnswer: 1, explanation: "إلى حرف جر." },
      { id: 6, text: "أكمل: 'سألت ... صديقي'", options: ["في", "عن", "من", "بـ"], correctAnswer: 1, explanation: "سأل عن." },
      { id: 7, text: "في 'بالقلم نكتب'، حرف الجر هو:", options: ["الباء", "نكتب", "القلم", "لا يوجد"], correctAnswer: 0, explanation: "الباء حرف جر متصل." },
      { id: 8, text: "إعراب 'الحديقة' في 'لعبت في الحديقة':", options: ["مفعول به", "فاعل", "اسم مجرور", "خبر"], correctAnswer: 2, explanation: "سبقه حرف جر." },
      { id: 9, text: "أي جملة تحتوي حرف جر؟", options: ["نمت مبكراً", "سافرت بالقطار", "أكلت التفاحة", "هذا ولد"], correctAnswer: 1, explanation: "الباء في بالقطار." },
      { id: 10, text: "حروف الجر تدخل على:", options: ["الأسماء فقط", "الأفعال فقط", "الأسماء والأفعال", "الحروف"], correctAnswer: 0, explanation: "تختص بالأسماء." }
    ],
    "الجزم": [
      { id: 1, text: "أداة تجزم الفعل المضارع:", options: ["لم", "لن", "كي", "حتى"], correctAnswer: 0, explanation: "لم من الجوازم." },
      { id: 2, text: "علامة جزم الفعل صحيح الآخر:", options: ["الفتحة", "الضمة", "السكون", "الكسرة"], correctAnswer: 2, explanation: "السكون هي العلامة الأصلية." },
      { id: 3, text: "علامة جزم الأفعال الخمسة:", options: ["حذف حرف العلة", "حذف النون", "السكون", "ثبوت النون"], correctAnswer: 1, explanation: "تحذف النون في الجزم." },
      { id: 4, text: "أكمل: 'لم ... الكسول'", options: ["ينجحُ", "ينجحَ", "ينجحْ", "ينجحِ"], correctAnswer: 2, explanation: "مجزوم بالسكون." },
      { id: 5, text: "'لا الناهية' تفيد:", options: ["النفي", "الطلب والكف", "التأكيد", "الاستدراك"], correctAnswer: 1, explanation: "تطلب الكف عن الفعل وتجزم." },
      { id: 6, text: "ما إعراب 'تسعَ' في 'لا تسعَ في الشر'؟", options: ["مرفوع", "منصوب", "مجزوم بحذف حرف العلة", "مبني"], correctAnswer: 2, explanation: "أصله تسعى، حذفت الألف للجزم." },
      { id: 7, text: "لام الأمر تدخل على الفعل:", options: ["الماضي", "المضارع", "الأمر", "الاسم"], correctAnswer: 1, explanation: "مثل: لِتكتبْ." },
      { id: 8, text: "أي جملة صحيحة؟", options: ["لا تهملُ", "لم يذهبون", "لا تجذبْ", "لن يذاكرْ"], correctAnswer: 2, explanation: "مجزوم بالسكون." },
      { id: 9, text: "أداة تجزم فعلين:", options: ["لم", "لما", "إن الشرطية", "لام الأمر"], correctAnswer: 2, explanation: "تجزم فعل الشرط وجوابه." },
      { id: 10, text: "علامة جزم 'يدعُ' في 'لم يدعُ':", options: ["السكون", "حذف حرف العلة", "الضمة", "الفتحة"], correctAnswer: 1, explanation: "حذفت الواو." }
    ]
  };

  const genericQuestions = Array.from({ length: 10 }, (_, i) => ({
    id: startId + i,
    text: `${diffPrefix} حدد الإجابة المتعلقة بـ ${topic} (سؤال ${i + 1})؟`,
    options: ["الخيار الصحيح", "خيار غير دقيق", "تحقق من القاعدة", "ربما في محطة أخرى"],
    correctAnswer: 0,
    explanation: `هذه قاعدة هامة في ${topic} يجب إتقانها لتحقيق أفضل هامبورجر نحوي.`
  }));

  return contentMap[topic] || genericQuestions;
};

// --- المبتدئ (BEGINNER) ---
export const STATIONS_BEGINNER: Station[] = [
  {
    id: 1,
    title: "أنواع الكلمة",
    description: "الاسم والفعل والحرف",
    summaryPoints: ["الاسم يدل على إنسان أو حيوان أو جماد.", "الفعل يدل على حدث مرتبط بزمن.", "الحرف لا يظهر معناه إلا مع غيره."],
    questions: [
      { id: 1, text: "كلمة 'مدرسة' تعتبر:", options: ["اسم", "فعل", "حرف", "جملة"], correctAnswer: 0, explanation: "مدرسة اسم مكان." },
      { id: 2, text: "أي الكلمات التالية فعل؟", options: ["محمد", "في", "كتب", "كتاب"], correctAnswer: 2, explanation: "كتب يدل على حدث القراءة في الماضي." },
      { id: 3, text: "'إلى' هي كلمة من نوع:", options: ["اسم", "فعل", "حرف", "خبر"], correctAnswer: 2, explanation: "إلى حرف جر." },
      { id: 4, text: "الاسم الذي يبدأ بـ 'ال' يسمى:", options: ["فعل", "معرفة", "نكرة", "حرف"], correctAnswer: 1, explanation: "ال التعريف تجعل الاسم معرفة." },
      { id: 5, text: "كلمة 'يشرب' تدل على زمن:", options: ["ماضٍ", "مضارع", "أمر", "مستقبل"], correctAnswer: 1, explanation: "تبدأ بياء المضارعة." },
      { id: 6, text: "أي كلمة هي اسم حيوان؟", options: ["بيت", "أسد", "جرى", "على"], correctAnswer: 1, explanation: "الأسد اسم لحيوان." },
      { id: 7, text: "كلمة 'من' تعتبر:", options: ["حرف جر", "فعل ماض", "اسم إشارة", "مبتدأ"], correctAnswer: 0, explanation: "من حرف من حروف الجر." },
      { id: 8, text: "الكلمة التي تدل على طلب القيام بعمل هي:", options: ["اسم", "فعل ماض", "فعل أمر", "حرف"], correctAnswer: 2, explanation: "فعل الأمر يفيد الطلب." },
      { id: 9, text: "'التفاحة لذيذة'، الكلمة الأولى نوعها:", options: ["فعل", "اسم", "حرف", "ظرف"], correctAnswer: 1, explanation: "التفاحة اسم فاكهة." },
      { id: 10, text: "أي مما يلي ليس من أنواع الكلمة؟", options: ["الاسم", "الفعل", "الخبر", "الحرف"], correctAnswer: 2, explanation: "الخبر موقع إعرابي وليس نوعاً للكلمة." }
    ]
  },
  {
    id: 2,
    title: "الجملة الاسمية",
    description: "المبتدأ والخبر",
    summaryPoints: ["تبدأ الجملة الاسمية باسم.", "تتكون من ركنين: مبتدأ وخبر.", "المبتدأ والخبر مرفوعان دائماً."],
    questions: [
      { id: 1, text: "الجملة التي تبدأ باسم تسمى:", options: ["فعلية", "اسمية", "حرفية", "شبه جملة"], correctAnswer: 1, explanation: "تبدأ باسم فهي اسمية." },
      { id: 2, text: "في 'العلم نور'، كلمة 'العلم' هي:", options: ["خبر", "مبتدأ", "فاعل", "مفعول به"], correctAnswer: 1, explanation: "الاسم الذي نبدأ به هو المبتدأ." },
      { id: 3, text: "الخبر هو الجزء الذي:", options: ["نبدأ به", "يتمم المعنى", "يدل على الفعل", "يجر ما قبله"], correctAnswer: 1, explanation: "الخبر يخبرنا معلومة عن المبتدأ." },
      { id: 4, text: "علامة رفع المبتدأ المفرد:", options: ["الفتحة", "الكسرة", "الضمة", "السكون"], correctAnswer: 2, explanation: "الضمة هي علامة الرفع الأصلية." },
      { id: 5, text: "'السماء صافية'.. 'صافية' تعرب:", options: ["مبتدأ", "خبر", "نعت", "اسم مجرور"], correctAnswer: 1, explanation: "أتمت معنى السماء فهي خبر." },
      { id: 6, text: "أي جملة هي جملة اسمية؟", options: ["نام الطفل", "الجو جميل", "ذهب علي", "اكتب الدرس"], correctAnswer: 1, explanation: "بدأت باسم." },
      { id: 7, text: "المبتدأ يكون دائماً:", options: ["منصوباً", "مجروراً", "مرفوعاً", "ساكناً"], correctAnswer: 2, explanation: "المبتدأ من المرفوعات." },
      { id: 8, text: "كلمة 'المعلمان' ترفع بـ:", options: ["الضمة", "الألف", "الواو", "النون"], correctAnswer: 1, explanation: "لأنه مثنى." },
      { id: 9, text: "في 'هم مخلصون'، المبتدأ هو:", options: ["هم", "مخلصون", "مستتر", "لا يوجد"], correctAnswer: 0, explanation: "الضمير المنفصل يحل محل المبتدأ." },
      { id: 10, text: "الجملة الاسمية تتكون من:", options: ["فعل وفاعل", "مبتدأ وخبر", "جار ومجرور", "مضاف إليه"], correctAnswer: 1, explanation: "ركنان أساسيان." }
    ]
  },
  {
    id: 3,
    title: "الجملة الفعلية",
    description: "الفعل والفاعل",
    summaryPoints: ["تبدأ بفعل.", "تتكون من فعل وفاعل.", "الفاعل هو من قام بالحدث."],
    questions: [
      { id: 1, text: "الجملة التي تبدأ بفعل تسمى:", options: ["اسمية", "فعلية", "ظرفية", "ناقصة"], correctAnswer: 1, explanation: "تبدأ بفعل فهي فعلية." },
      { id: 2, text: "من قام بالفعل يسمى:", options: ["مبتدأ", "خبر", "فاعل", "مفعول به"], correctAnswer: 2, explanation: "هذا تعريف الفاعل." },
      { id: 3, text: "الفاعل يكون دائماً:", options: ["منصوباً", "مجروراً", "مرفوعاً", "ساكناً"], correctAnswer: 2, explanation: "الفاعل من المرفوعات." },
      { id: 4, text: "في 'نجح المجتهد'، الفاعل هو:", options: ["نجح", "المجتهد", "ضمير مستتر", "النجاح"], correctAnswer: 1, explanation: "المجتهد هو من نجح." },
      { id: 5, text: "أي فعل هو فعل أمر؟", options: ["يلعب", "لعب", "العب", "لعبة"], correctAnswer: 2, explanation: "يدل على طلب الفعل." },
      { id: 6, text: "الفعل 'شرب' هو فعل:", options: ["ماض", "مضارع", "أمر", "مستقبل"], correctAnswer: 0, explanation: "حدث وانتهى." },
      { id: 7, text: "علامة رفع الفاعل المفرد:", options: ["الفتحة", "الضمة", "الكسرة", "السكون"], correctAnswer: 1, explanation: "الضمة للمفرد." },
      { id: 8, text: "أي جملة هي جملة فعلية؟", options: ["البيت واسع", "فهم الطالب", "أنا بخير", "هذا قلم"], correctAnswer: 1, explanation: "بدأت بفعل." },
      { id: 9, text: "الفاعل في 'ذهبتُ' هو:", options: ["مستتر", "التاء", "الذهاب", "لا يوجد"], correctAnswer: 1, explanation: "التاء ضمير متصل فاعل." },
      { id: 10, text: "الفعل المضارع يبدأ غالباً بـ:", options: ["أحد حروف (أنيت)", "حرف الجر", "ال التعريف", "التنوين"], correctAnswer: 0, explanation: "مثل: أكتب، نكتب، يكتب، تكتب." }
    ]
  },
  { id: 4, title: "المفعول به", description: "من وقع عليه الفعل", summaryPoints: ["اسم منصوب.", "يأتي في الجملة الفعلية.", "يدل على من وقع عليه فعل الفاعل."], questions: createQuestionsForTopic("المفعول به", "BEGINNER") },
  { id: 5, title: "حروف الجر", description: "من، إلى، عن، على..", summaryPoints: ["تجر الاسم الذي بعدها.", "علامة الجر الأصلية الكسرة.", "تدخل على الأسماء فقط."], questions: createQuestionsForTopic("حروف الجر", "BEGINNER") },
  { id: 6, title: "ظرف الزمان والمكان", description: "أين ومتى؟", summaryPoints: ["ظرف الزمان يدل على وقت.", "ظرف المكان يدل على موقع.", "غالباً يكون منصوباً."], questions: createQuestionsForTopic("الظروف", "BEGINNER") },
  { id: 7, title: "أسماء الإشارة", description: "هذا وهذه..", summaryPoints: ["تستخدم للإشارة للشيء.", "هذا للمفرد المذكر.", "هذه للمفردة المؤنثة."], questions: createQuestionsForTopic("أسماء الإشارة", "BEGINNER") },
  { id: 8, title: "الأسماء الموصولة", description: "الذي والتي..", summaryPoints: ["تصل الكلام ببعضه.", "الذي للمذكر.", "التي للمؤنث."], questions: createQuestionsForTopic("الأسماء الموصولة", "BEGINNER") },
  { id: 9, title: "المفرد والجمع", description: "واحد أو أكثر", summaryPoints: ["المفرد يدل على واحد.", "الجمع يدل على ثلاثة فأكثر.", "يوجد جمع مذكر ومؤنث وتكسير."], questions: createQuestionsForTopic("العدد", "BEGINNER") },
  { id: 10, title: "مراجعة المبتدئ", description: "اختبار شامل", summaryPoints: ["تأكد من فهمك لكل ما سبق.", "اجمع المكونات الأخيرة.", "استعد للمستوى المتوسط!"], questions: createQuestionsForTopic("المراجعة العامة", "BEGINNER") }
];

// --- المتوسط (INTERMEDIATE) ---
export const STATIONS_INTERMEDIATE: Station[] = [
  {
    id: 1,
    title: "المثنى وإعرابه",
    description: "الألف والياء",
    summaryPoints: ["يدل على اثنين أو اثنتين.", "يرفع بالألف.", "ينصب ويجر بالياء."],
    questions: [
      { id: 1, text: "علامة رفع المثنى:", options: ["الضمة", "الألف", "الواو", "النون"], correctAnswer: 1, explanation: "يرفع بالألف." },
      { id: 2, text: "نقول 'رأيت ...' (أكمل بمثنى):", options: ["الولدان", "الولدين", "الولد", "الأولاد"], correctAnswer: 1, explanation: "ينصب بالياء." },
      { id: 3, text: "المثنى من 'شجرة':", options: ["شجرات", "شجرتان", "شجرون", "أشجار"], correctAnswer: 1, explanation: "ألف ونون للمثنى." },
      { id: 4, text: "علامة جر المثنى:", options: ["الكسرة", "الياء", "الفتحة", "الألف"], correctAnswer: 1, explanation: "يجر بالياء." },
      { id: 5, text: "نون المثنى تكون دائماً:", options: ["مفتوحة", "مكسورة", "ساكنة", "مضمومة"], correctAnswer: 1, explanation: "مثل: كتابانِ." },
      { id: 6, text: "في 'جاء الطالبان'، الفاعل مرفوع بـ:", options: ["الضمة", "الألف", "النون", "الفتحة"], correctAnswer: 1, explanation: "لأنه مثنى." },
      { id: 7, text: "أي كلمة هي مثنى؟", options: ["عثمان", "طالبان", "جوعان", "فرحان"], correctAnswer: 1, explanation: "تدل على اثنين." },
      { id: 8, text: "المثنى المؤنث من 'معلم':", options: ["معلمتان", "معلمان", "معلمون", "معلمات"], correctAnswer: 0, explanation: "معلمة تصبح معلمتان." },
      { id: 9, text: "عند إضافة 'في' للمثنى يصبح:", options: ["بالألف", "بالياء", "بالضمة", "بالكسرة"], correctAnswer: 1, explanation: "لأنه يجر بالياء." },
      { id: 10, text: "نحذف نون المثنى عند:", options: ["النصب", "الجر", "الإضافة", "التعريف"], correctAnswer: 2, explanation: "قاعدة الإضافة." }
    ]
  },
  {
    id: 2,
    title: "جمع المذكر السالم",
    description: "الواو والياء",
    summaryPoints: ["يرفع بالواو.", "ينصب ويجر بالياء.", "نون الجمع مفتوحة دائماً."],
    questions: [
      { id: 1, text: "علامة رفع جمع المذكر السالم:", options: ["الضمة", "الواو", "الألف", "ثبوت النون"], correctAnswer: 1, explanation: "يرفع بالواو." },
      { id: 2, text: "كلمة 'مؤمنون' تعرب في الرفع:", options: ["بالضمة", "بالواو", "بالألف", "بالنون"], correctAnswer: 1, explanation: "جمع مذكر سالم." },
      { id: 3, text: "علامة نصبه وجره:", options: ["الكسرة", "الياء", "الفتحة", "الألف"], correctAnswer: 1, explanation: "الياء للجمع والمثنى." },
      { id: 4, text: "أي جملة صحيحة؟", options: ["حضر المعلمين", "حضر المعلمون", "حضر المعلمات", "حضر المعلمتين"], correctAnswer: 1, explanation: "فاعل مرفوع بالواو." },
      { id: 5, text: "نون جمع المذكر السالم:", options: ["مكسورة", "مفتوحة", "ساكنة", "لا توجد"], correctAnswer: 1, explanation: "مثل: مسلمونَ." },
      { id: 6, text: "مفرد 'مهندسون':", options: ["مهندس", "هندسة", "مهندسة", "هندس"], correctAnswer: 0, explanation: "اسم مفرد مذكر." },
      { id: 7, text: "عند النصب نقول:", options: ["صادقون", "صادقين", "صادقو", "صادقات"], correctAnswer: 1, explanation: "ينصب بالياء." },
      { id: 8, text: "أي كلمة ليست جمع مذكر سالم؟", options: ["عاملون", "مساكين", "فلاحون", "مخلصون"], correctAnswer: 1, explanation: "مساكين جمع تكسير." },
      { id: 9, text: "يرفع بالواو نيابة عن:", options: ["الفتحة", "الضمة", "الكسرة", "السكون"], correctAnswer: 1, explanation: "الضمة هي العلامة الأصلية." },
      { id: 10, text: "تحذف نونه أيضاً عند:", options: ["النصب", "الإضافة", "الجر", "دخول ال"], correctAnswer: 1, explanation: "مثل: معلمو المدرسة." }
    ]
  },
  { id: 3, title: "جمع المؤنث السالم", description: "الألف والتاء", summaryPoints: ["ينتهي بألف وتحد زائدتين.", "يرفع بالضمة.", "ينصب ويجر بالكسرة."], questions: createQuestionsForTopic("جمع المؤنث", "INTERMEDIATE") },
  { id: 4, title: "كان وأخواتها", description: "الأفعال الناسخة", summaryPoints: ["تدخل على الجملة الاسمية.", "ترفع المبتدأ وتنصب الخبر.", "أخواتها: أصبح، أضحى، ظل.."], questions: createQuestionsForTopic("الأفعال الناسخة", "INTERMEDIATE") },
  { id: 5, title: "إن وأخواتها", description: "الحروف الناسخة", summaryPoints: ["تنصب المبتدأ وترفع الخبر.", "أخواتها: أن، كأن، لعل، ليت..", "تفيد التوكيد والتشبيه والترجي."], questions: createQuestionsForTopic("الحروف الناسخة", "INTERMEDIATE") },
  { id: 6, title: "الفاعل المستتر", description: "أين اختفى الفاعل؟", summaryPoints: ["قد يكون الفاعل غير ظاهر.", "يقدر بـ: هو، هي، أنا، نحن..", "يأتي بعد الفعل دائماً."], questions: createQuestionsForTopic("الفاعل المستتر", "INTERMEDIATE") },
  { id: 7, title: "الضمائر المتصلة", description: "التاء، النا، الواو..", summaryPoints: ["تتصل بالاسم أو الفعل أو الحرف.", "في الفعل قد تكون فاعلاً.", "في الاسم تكون مضافاً إليه."], questions: createQuestionsForTopic("الضمائر", "INTERMEDIATE") },
  { id: 8, title: "المضاف إليه", description: "اسم يوضح ما قبله", summaryPoints: ["يكون مجروراً دائماً.", "يأتي بعد اسم نكرة غالباً.", "يوضح ويحدد المعنى."], questions: createQuestionsForTopic("المضاف إليه", "INTERMEDIATE") },
  { id: 9, title: "النعت (الصفة)", description: "وصف الاسم", summaryPoints: ["يتبع المنعوت في كل شيء.", "الإعراب، التعريف، النوع، العدد.", "يصف اسماً قبله."], questions: createQuestionsForTopic("النعت", "INTERMEDIATE") },
  { id: 10, title: "مراجعة المتوسط", description: "تحدي الشيف المحترف", summaryPoints: ["أنت الآن قريب من القمة.", "راجع علامات الإعراب الفرعية.", "استعد لمستوى المحترفين!"], questions: createQuestionsForTopic("المراجعة العامة", "INTERMEDIATE") }
];

// --- المحترف (ADVANCED) ---
export const STATIONS_ADVANCED: Station[] = [
  {
    id: 1,
    title: "الأفعال الخمسة",
    description: "ثبوت وحذف النون",
    summaryPoints: ["كل مضارع اتصل به واو الجماعة، ألف الاثنين، أو ياء المخاطبة.", "ترفع بثبوت النون.", "تنصب وتجزم بحذف النون."],
    questions: [
      { id: 1, text: "علامة رفع الأفعال الخمسة:", options: ["الضمة", "ثبوت النون", "الواو", "الألف"], correctAnswer: 1, explanation: "ثبوت النون للرفع." },
      { id: 2, text: "عند جزم 'يكتبون' بـ 'لم' تصبح:", options: ["لم يكتبون", "لم يكتبوا", "لم يكتبن", "لم يكتبا"], correctAnswer: 1, explanation: "تحذف النون للجزم." },
      { id: 3, text: "أي فعل هو من الأفعال الخمسة؟", options: ["كتبوا", "يكتبون", "اكتبوا", "يكتب"], correctAnswer: 1, explanation: "يجب أن يكون مضارعاً." },
      { id: 4, text: "علامة نصب الأفعال الخمسة:", options: ["الفتحة", "حذف النون", "ثبوت النون", "الياء"], correctAnswer: 1, explanation: "النصب والجزم بحذف النون." },
      { id: 5, text: "الفاعل في 'يعملان' هو:", options: ["مستتر", "الألف", "النون", "يعمل"], correctAnswer: 1, explanation: "ألف الاثنين فاعل." },
      { id: 6, text: "'أنتِ تذاكرين'.. الفعل مرفوع بـ:", options: ["الضمة", "ثبوت النون", "الياء", "الكسرة"], correctAnswer: 1, explanation: "لاتصاله بياء المخاطبة." },
      { id: 7, text: "أي جملة صحيحة؟", options: ["هم لم يذهبون", "هم لم يذهبوا", "هم لم يذهبا", "هم لم يذهب"], correctAnswer: 1, explanation: "جزم بحذف النون." },
      { id: 8, text: "الأفعال الخمسة ترفع بـ:", options: ["حركة أصلية", "حركة فرعية", "علامة مقدرة", "لا ترفع"], correctAnswer: 1, explanation: "النون علامة فرعية." },
      { id: 9, text: "في 'يجب أن تجتهدي'.. الفعل منصوب بـ:", options: ["الفتحة", "حذف النون", "الكسرة", "ثبوت النون"], correctAnswer: 1, explanation: "لأنه من الأفعال الخمسة." },
      { id: 10, text: "هل 'كانوا' من الأفعال الخمسة؟", options: ["نعم", "لا", "فقط في الجزم", "أحياناً"], correctAnswer: 1, explanation: "لا، لأنه ماض." }
    ]
  },
  {
    id: 2,
    title: "الأسماء الخمسة",
    description: "أبوك، أخوك، حمو، فو، ذو",
    summaryPoints: ["ترفع بالواو.", "تنصب بالألف.", "تجر بالياء.", "بشرط الإضافة لغير ياء المتكلم."],
    questions: [
      { id: 1, text: "ترفع الأسماء الخمسة بـ:", options: ["الضمة", "الواو", "الألف", "الياء"], correctAnswer: 1, explanation: "الواو للرفع." },
      { id: 2, text: "نقول 'رأيت ...' (أكمل بمفعول به):", options: ["أبوك", "أباك", "أبيك", "أب"], correctAnswer: 1, explanation: "تنصب بالألف." },
      { id: 3, text: "علامة جر الأسماء الخمسة:", options: ["الكسرة", "الياء", "الفتحة", "الألف"], correctAnswer: 1, explanation: "تجر بالياء." },
      { id: 4, text: "أي جملة صحيحة؟", options: ["جاء ذو العلم", "جاء ذا العلم", "جاء ذي العلم", "جاء صاحب"], correctAnswer: 0, explanation: "ذو فاعل مرفوع بالواو." },
      { id: 5, text: "كلمة 'أخي' لا تعتبر منها لأنها:", options: ["مثنى", "مضافة لياء المتكلم", "نكرة", "جمع"], correctAnswer: 1, explanation: "يجب ألا تضاف لياء المتكلم." },
      { id: 6, text: "معنى 'فوك':", options: ["أخوك", "أبوك", "فمك", "صاحب"], correctAnswer: 2, explanation: "فو تعني الفم." },
      { id: 7, text: "في 'سلمت على أبيك'.. الإعراب مجرور بـ:", options: ["الكسرة", "الياء", "الفتحة", "الألف"], correctAnswer: 1, explanation: "لأنه من الأسماء الخمسة." },
      { id: 8, text: "شرط إعرابها بالحروف أن تكون:", options: ["مفردة", "مثنى", "جمع", "معرفة بـ ال"], correctAnswer: 0, explanation: "يجب أن تكون مفردة." },
      { id: 9, text: "إن ... العلم محبوب (أكمل):", options: ["ذو", "ذا", "ذي", "صاحب"], correctAnswer: 1, explanation: "اسم إن منصوب بالألف." },
      { id: 10, text: "هل 'أبوان' منها؟", options: ["نعم", "لا", "فقط في الرفع", "أحياناً"], correctAnswer: 1, explanation: "لا، لأنها مثنى." }
    ]
  },
  {
    id: 3,
    title: "نصب المضارع",
    description: "أن، لن، كي، حتى..",
    summaryPoints: ["ينصب بفتحة ظاهرة أو مقدرة.", "ينصب بحذف النون في الأفعال الخمسة.", "أدواته: أن، لن، كي، حتى، لام التعليل."],
    questions: [
      { id: 1, text: "أي أداة تنصب المضارع؟", options: ["لم", "لا الناهية", "كي", "إن الشرطية"], correctAnswer: 2, explanation: "كي من النواصب." },
      { id: 2, text: "علامة نصب 'يسافر' في 'لن يسافر':", options: ["الضمة", "الفتحة", "السكون", "الكسرة"], correctAnswer: 1, explanation: "الفتحة الظاهرة." },
      { id: 3, text: "الفعل 'تذهبوا' منصوب بـ:", options: ["الفتحة", "حذف النون", "ثبوت النون", "السكون"], correctAnswer: 1, explanation: "من الأفعال الخمسة." },
      { id: 4, text: "ما معنى 'لن'؟", options: ["نفي الماضي", "نفي المستقبل", "الطلب", "الاستدراك"], correctAnswer: 1, explanation: "نفي المستقبل." },
      { id: 5, text: "أكمل: 'جئت لـ ... الدرس'", options: ["أفهمُ", "أفهمَ", "أفهمْ", "أفهمِ"], correctAnswer: 1, explanation: "لام التعليل تنصب." },
      { id: 6, text: "هل 'أن' تنصب المضارع؟", options: ["نعم", "لا", "أحياناً", "فقط في الماضي"], correctAnswer: 0, explanation: "نعم." },
      { id: 7, text: "علامة نصب 'يرمي' في 'لن يرمي':", options: ["مقدرة", "ظاهرة", "حذف النون", "السكون"], correctAnswer: 1, explanation: "تظهر الفتحة على الياء." },
      { id: 8, text: "أداة تفيد الغاية والنصب:", options: ["كي", "حتى", "لن", "أن"], correctAnswer: 1, explanation: "حتى تفيد الغاية." },
      { id: 9, text: "في 'يجب أن تجتهدي'.. علامة النصب:", options: ["الفتحة", "حذف النون", "الكسرة", "ثبوت النون"], correctAnswer: 1, explanation: "ياء المخاطبة." },
      { id: 10, text: "النواصب تدخل على الفعل:", options: ["الماضي", "المضارع", "الأمر", "كل ما سبق"], correctAnswer: 1, explanation: "تختص بالمضارع." }
    ]
  },
  { id: 4, title: "جزم المضارع", description: "لم، لما، لا الناهية..", summaryPoints: ["يجزم بالسكون إذا كان صحيح الآخر.", "يجزم بحذف حرف العلة إذا كان معتل الآخر.", "يجزم بحذف النون في الأفعال الخمسة."], questions: createQuestionsForTopic("الجزم", "ADVANCED") },
  { id: 5, title: "كان وأخواتها (متقدم)", description: "التفاصيل الدقيقة", summaryPoints: ["أفعال ناقصة وناسخة.", "قد تأتي تامة في بعض السياقات.", "تعمل في الماضي والمضارع والأمر."], questions: createQuestionsForTopic("الأفعال الناسخة", "ADVANCED") },
  { id: 6, title: "إن وأخواتها (متقدم)", description: "لا النافية للجنس", summaryPoints: ["تعمل عمل إنَّ بشروط.", "تنفي الخبر عن كل أفراد الجنس.", "اسمها يكون مبنياً أو منصوباً."], questions: createQuestionsForTopic("الحروف الناسخة", "ADVANCED") },
  { id: 7, title: "نائب الفاعل", description: "المبني للمجهول", summaryPoints: ["يحل محل الفاعل بعد حذفه.", "يكون مرفوعاً دائماً.", "يتغير شكل الفعل معه."], questions: createQuestionsForTopic("نائب الفاعل", "ADVANCED") },
  { id: 8, title: "الحال", description: "هيئة الفاعل أو المفعول", summaryPoints: ["اسم نكرة منصوب.", "يوضح الهيئة وقت حدوث الفعل.", "يسأل عنه بـ 'كيف؟'."], questions: createQuestionsForTopic("الحال", "ADVANCED") },
  { id: 9, title: "التمييز", description: "إزالة الغموض", summaryPoints: ["اسم نكرة منصوب يوضح مبهماً قبله.", "تمييز الملفوظ وتمييز الملحوظ.", "مثل: اشتريت كيلواً عسلاً."], questions: createQuestionsForTopic("التمييز", "ADVANCED") },
  { id: 10, title: "المراجعة النهائية", description: "تاج النحو", summaryPoints: ["أنت الآن عملاق النحو العربي!", "لقد جمعت كل مكونات الهامبورجر.", "استمتع بالوليمة الكبرى!"], questions: createQuestionsForTopic("المراجعة العامة", "ADVANCED") }
];

export const getStationsByDifficulty = (diff: string) => {
  if (diff === 'INTERMEDIATE') return STATIONS_INTERMEDIATE;
  if (diff === 'ADVANCED') return STATIONS_ADVANCED;
  return STATIONS_BEGINNER;
};
