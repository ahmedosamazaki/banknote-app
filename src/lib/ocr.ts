export interface OcrResult {
  amount?: string;
  referenceNumber?: string;
  bankName?: string;
  date?: string;
  transferType?: 'instapay' | 'vodafone_cash';
}

// Simulate OCR extraction with realistic patterns
// In production, this would call an AI vision API
export async function simulateOcrExtraction(file: File): Promise<OcrResult> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      // Simulate processing time (1.5–2.5s)
      const delay = 1500 + Math.random() * 1000;
      setTimeout(() => {
        resolve(extractFromImageContext(file));
      }, delay);
    };
    reader.readAsDataURL(file);
  });
}

function extractFromImageContext(file: File): OcrResult {
  const name = file.name.toLowerCase();

  // Detect transfer type from filename hints
  const isVodafone =
    name.includes('vodafone') || name.includes('vf') || name.includes('vcash');
  const isInstapay =
    name.includes('instapay') || name.includes('insta') || name.includes('ip');

  const transferType = isVodafone
    ? 'vodafone_cash'
    : isInstapay
    ? 'instapay'
    : Math.random() > 0.5
    ? 'instapay'
    : 'vodafone_cash';

  // Generate realistic mock extracted data
  const banks = [
    'بنك مصر',
    'البنك الأهلي المصري',
    'CIB',
    'بنك القاهرة',
    'فودافون كاش',
    'بنك الإسكندرية',
    'بنك قطر الوطني الأهلي',
  ];

  const bankName =
    transferType === 'vodafone_cash'
      ? 'فودافون كاش'
      : banks[Math.floor(Math.random() * (banks.length - 1))];

  // Random but realistic amount (100–5000 EGP)
  const amounts = [250, 500, 750, 1000, 1500, 2000, 2500, 3000, 5000];
  const amount = amounts[Math.floor(Math.random() * amounts.length)];

  // Generate reference number
  const refPrefix = transferType === 'instapay' ? 'IP' : 'VC';
  const refNum = Math.floor(Math.random() * 9000000000) + 1000000000;
  const referenceNumber = `${refPrefix}${refNum}`;

  // Today or yesterday
  const date = new Date();
  if (Math.random() > 0.7) date.setDate(date.getDate() - 1);
  const dateStr = date.toLocaleDateString('ar-EG');

  return {
    amount: amount.toString(),
    referenceNumber,
    bankName,
    date: dateStr,
    transferType,
  };
}
