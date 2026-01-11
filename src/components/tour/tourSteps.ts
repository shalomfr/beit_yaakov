import { Step } from 'react-joyride';

export const tourSteps: Step[] = [
  {
    target: 'body',
    content: 'ברוכים הבאים למערכת ניהול הכספים של בית יעקב! בואו נעשה סיור מהיר ונלמד איך להשתמש במערכת.',
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: '[data-tour="stats-cards"]',
    content: 'כאן תוכלו לראות תמונת מצב כוללת - סך ההוצאות לגנים, לבית הספר, וסטטיסטיקות חודשיות.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="kindergarten-card"]',
    content: 'כרטיס זה מציג את סך ההוצאות של הגנים. השינוי באחוזים מראה השוואה לחודש הקודם.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="school-card"]',
    content: 'כרטיס זה מציג את סך ההוצאות של בית הספר עם השוואה לחודש הקודם.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="expense-types"]',
    content: 'כאן תוכלו לראות פילוח בין הוצאות קבועות (כמו משכורות) להוצאות מזדמנות.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="expense-chart"]',
    content: 'הגרף מציג פילוח של ההוצאות לפי קטגוריות - משכורות, חשמל, תחזוקה ועוד.',
    placement: 'left',
  },
  {
    target: '[data-tour="quick-actions"]',
    content: 'פעולות מהירות לשימוש יומיומי - הוספת הוצאה, העברות בין מסגרות, רישום חובות ודוחות.',
    placement: 'left',
  },
  {
    target: '[data-tour="add-expense-btn"]',
    content: 'לחצו כאן כדי להוסיף הוצאה חדשה. תוכלו לבחור מסגרת (גן/בי"ס), קטגוריה, סכום ותאריך.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="transfers-btn"]',
    content: 'כפתור זה מאפשר לבצע העברות כספים בין מסגרות - למשל מבית הספר לגנים.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="debts-btn"]',
    content: 'כאן תוכלו לרשום ולעקוב אחר חובות עובדים - מקדמות, הלוואות והחזרי הוצאות.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="recent-expenses"]',
    content: 'טבלה זו מציגה את ההוצאות האחרונות עם פרטים מלאים - תיאור, סכום, תאריך ומסגרת.',
    placement: 'top',
  },
  {
    target: '[data-tour="sidebar"]',
    content: 'התפריט הצדדי מאפשר ניווט בין דפים שונים - דשבורד, הוצאות, העברות, חובות, עובדים והגדרות.',
    placement: 'left',
  },
  {
    target: '[data-tour="expenses-nav"]',
    content: 'דף ההוצאות מאפשר לצפות בכל ההוצאות, לסנן לפי תאריכים ומסגרות, ולייצא דוחות.',
    placement: 'left',
  },
  {
    target: 'body',
    content: 'זהו! סיימנו את הסיור. האם תרצו לטעון נתוני דמו לתרגול? תוכלו תמיד לאפס אותם בהגדרות.',
    placement: 'center',
  },
];
