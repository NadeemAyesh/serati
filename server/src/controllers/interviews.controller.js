const {
  interviewQuestions,
  examPapers,
  institutionTips
} = require('../data/interviewQuestions.data');

// @desc    الحصول على أسئلة المقابلات الشخصية مع التصفية والبحث
// @route   GET /api/interviews-exams/questions
exports.getQuestions = (req, res) => {
  try {
    const { category, difficulty, search } = req.query;
    let filtered = [...interviewQuestions];

    if (category && category !== 'all') {
      filtered = filtered.filter(q => q.category.toLowerCase() === category.toLowerCase());
    }

    if (difficulty && difficulty !== 'all') {
      filtered = filtered.filter(q => q.difficulty === difficulty);
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(q) ||
        item.categoryName.toLowerCase().includes(q) ||
        item.institutionTarget.toLowerCase().includes(q) ||
        item.modelAnswer.toLowerCase().includes(q)
      );
    }

    res.status(200).json({
      success: true,
      count: filtered.length,
      data: filtered
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'فشل في استرجاع أسئلة المقابلات: ' + error.message
    });
  }
};

// @desc    الحصول على قائمة نماذج امتحانات التوظيف المؤسسية
// @route   GET /api/interviews-exams/exams
exports.getExams = (req, res) => {
  try {
    // Return exam metadata (without full questions to keep light)
    const summary = examPapers.map(exam => ({
      id: exam.id,
      title: exam.title,
      institution: exam.institution,
      institutionTag: exam.institutionTag,
      field: exam.field,
      durationMinutes: exam.durationMinutes,
      passingScorePercentage: exam.passingScorePercentage,
      badgeColor: exam.badgeColor,
      icon: exam.icon,
      description: exam.description,
      questionsCount: exam.questions.length
    }));

    res.status(200).json({
      success: true,
      count: summary.length,
      data: summary
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'فشل في استرجاع نماذج الامتحانات: ' + error.message
    });
  }
};

// @desc    الحصول على تفاصيل امتحان محدد بالأسئلة
// @route   GET /api/interviews-exams/exams/:id
exports.getExamById = (req, res) => {
  try {
    const exam = examPapers.find(e => e.id === req.params.id);
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'نموذج الامتحان غير موجود'
      });
    }

    res.status(200).json({
      success: true,
      data: exam
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'فشل في استرجاع بيانات الامتحان: ' + error.message
    });
  }
};

// @desc    تسليم إجابات الامتحان وتصحيحه تلقائياً مع الشرح التفصيلي
// @route   POST /api/interviews-exams/exams/:id/submit
exports.submitExam = (req, res) => {
  try {
    const exam = examPapers.find(e => e.id === req.params.id);
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'نموذج الامتحان غير موجود'
      });
    }

    const { userAnswers } = req.body; // Map or object: { 'cs-q1': 1, 'cs-q2': 0, ... }
    if (!userAnswers || typeof userAnswers !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'يرجى تقديم إجابات الامتحان للتصحيح'
      });
    }

    let correctCount = 0;
    const totalQuestions = exam.questions.length;

    const breakdown = exam.questions.map(q => {
      const selectedIndex = userAnswers[q.id] !== undefined ? Number(userAnswers[q.id]) : null;
      const isCorrect = selectedIndex === q.correctIndex;
      if (isCorrect) correctCount++;

      return {
        questionId: q.id,
        questionText: q.text,
        options: q.options,
        userAnswerIndex: selectedIndex,
        userAnswerText: selectedIndex !== null ? q.options[selectedIndex] : 'لم تتم الإجابة',
        correctAnswerIndex: q.correctIndex,
        correctAnswerText: q.options[q.correctIndex],
        isCorrect,
        explanation: q.explanation
      };
    });

    const scorePercentage = Math.round((correctCount / totalQuestions) * 100);
    const hasPassed = scorePercentage >= exam.passingScorePercentage;

    let evaluationFeedback = '';
    if (scorePercentage >= 90) {
      evaluationFeedback = 'أداء استثنائي وممتاز جداً! جاهزيتك لمقابلات واختبارات هذه المؤسسة على أعلى مستوى.';
    } else if (scorePercentage >= 70) {
      evaluationFeedback = 'نتيجة جيدة جداً وناجحة! لديك أساس معرفي صلب، راجع الملاحظات الطفيفة لتصل إلى درجة الامتياز.';
    } else if (hasPassed) {
      evaluationFeedback = 'لقد اجتزت الامتحان بنجاح بالحد المقبول. يُنصح بمراجعة المفاهيم المشروحة أدناه لتعزيز فرص قبولك.';
    } else {
      evaluationFeedback = 'لم تجتز درجة النجاح المطلوبة لهذه المؤسسة. لا تقلق، استغل الشروحات المرفقة أدناه وأعد الاختبار للتمكن من المادة.';
    }

    res.status(200).json({
      success: true,
      result: {
        examId: exam.id,
        examTitle: exam.title,
        institution: exam.institution,
        totalQuestions,
        correctCount,
        incorrectCount: totalQuestions - correctCount,
        scorePercentage,
        passingScorePercentage: exam.passingScorePercentage,
        hasPassed,
        evaluationFeedback,
        submittedAt: new Date().toISOString(),
        breakdown
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'فشل في تصحيح الامتحان: ' + error.message
    });
  }
};

// @desc    الحصول على نصائح لجان المقابلات حسب المؤسسة
// @route   GET /api/interviews-exams/tips
exports.getTips = (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: institutionTips
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'فشل في استرجاع نصائح المقابلات: ' + error.message
    });
  }
};
