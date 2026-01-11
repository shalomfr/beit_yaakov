import { Step } from 'react-joyride';

export interface ExtendedStep extends Step {
  isInteractive?: boolean;
  actionType?: 'click' | 'navigate';
}

export const tourSteps: ExtendedStep[] = [
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
    content: 'פעולות מהירות לשימוש יומיומי - כעת נלמד על כל אחת מהפעולות.',
    placement: 'left',
  },
  {
    target: '[data-tour="add-expense-btn"]',
    content: '👆 נסה עכשיו! לחץ על כפתור זה כדי להוסיף הוצאה חדשה. תוכל לבחור מסגרת, קטגוריה, סכום ותאריך.',
    placement: 'bottom',
    spotlightClicks: true,
    hideFooter: true,
    isInteractive: true,
    actionType: 'click',
  },
  {
    target: '[data-tour="transfers-btn"]',
    content: '👆 נסה עכשיו! לחץ כדי לבצע העברת כספים בין מסגרות - למשל מבית הספר לגנים.',
    placement: 'bottom',
    spotlightClicks: true,
    hideFooter: true,
    isInteractive: true,
    actionType: 'click',
  },
  {
    target: '[data-tour="debts-btn"]',
    content: '👆 נסה עכשיו! לחץ כדי לרשום ולעקוב אחר חובות עובדים - מקדמות, הלוואות והחזרים.',
    placement: 'bottom',
    spotlightClicks: true,
    hideFooter: true,
    isInteractive: true,
    actionType: 'click',
  },
  {
    target: '[data-tour="reports-btn"]',
    content: '👆 נסה עכשיו! לחץ כדי להפיק דוחות מפורטים - חודשיים, לפי מסגרת, קטגוריה ועוד.',
    placement: 'bottom',
    spotlightClicks: true,
    hideFooter: true,
    isInteractive: true,
    actionType: 'click',
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
    content: 'מעולה! סיימנו את הסיור. עכשיו אתה מוכן להתחיל להשתמש במערכת. בהצלחה!',
    placement: 'center',
  },
];

// Get indices of interactive steps
export const interactiveStepIndices = tourSteps
  .map((step, index) => step.isInteractive ? index : -1)
  .filter(index => index !== -1);
