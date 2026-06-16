export interface LegalSection {
  id: string;
  act: string;
  section: string;
  title: string;
  summary: string;
  keywords: string[];
  fullText: string;
}

export const legalKnowledgeBase: LegalSection[] = [
  // ==========================================
  // 1. Digital Personal Data Protection Act 2023
  // ==========================================
  {
    id: 'dpdp-sec-6',
    act: 'DPDP Act 2023',
    section: 'Section 6',
    title: 'Consent',
    summary: 'Consent must be free, specific, informed, unconditional, and unambiguous.',
    keywords: ['consent', 'data processing', 'personal data', 'privacy policy', 'data principal', 'unambiguous', 'unconditional', 'withdraw consent', 'notice'],
    fullText: 'Personal data may be processed only for a lawful purpose for which the Data Principal has given or is deemed to have given her consent. Consent must be free, specific, informed, unconditional and unambiguous with a clear affirmative action. The Data Principal has the right to withdraw consent at any time.'
  },
  {
    id: 'dpdp-sec-8',
    act: 'DPDP Act 2023',
    section: 'Section 8',
    title: 'General Obligations of Data Fiduciary',
    summary: 'Data Fiduciaries must ensure data accuracy, implement security safeguards, and report breaches.',
    keywords: ['data fiduciary', 'breach', 'security safeguards', 'data protection officer', 'accuracy', 'deletion', 'retention', 'data processor', 'liability'],
    fullText: 'A Data Fiduciary is responsible for compliance. They must ensure completeness, accuracy, and consistency of personal data, implement reasonable security safeguards, and notify the Data Protection Board and affected Data Principals in the event of a personal data breach. Data must be erased when the specified purpose is met or consent is withdrawn.'
  },

  // ==========================================
  // 2. Indian Contract Act 1872
  // ==========================================
  {
    id: 'ica-sec-10',
    act: 'Indian Contract Act 1872',
    section: 'Section 10',
    title: 'What agreements are contracts',
    summary: 'Agreements made by free consent of competent parties, for lawful consideration and object, are contracts.',
    keywords: ['agreement', 'contract', 'free consent', 'competent', 'lawful consideration', 'lawful object', 'validity', 'void'],
    fullText: 'All agreements are contracts if they are made by the free consent of parties competent to contract, for a lawful consideration and with a lawful object, and are not hereby expressly declared to be void.'
  },
  {
    id: 'ica-sec-23',
    act: 'Indian Contract Act 1872',
    section: 'Section 23',
    title: 'Lawful consideration and object',
    summary: 'Consideration or object is lawful unless forbidden by law, fraudulent, or against public policy.',
    keywords: ['consideration', 'object', 'fraudulent', 'public policy', 'immoral', 'forbidden', 'lawful'],
    fullText: 'The consideration or object of an agreement is lawful, unless it is forbidden by law; or is of such a nature that, if permitted, it would defeat the provisions of any law; or is fraudulent; or involves or implies injury to the person or property of another; or the Court regards it as immoral, or opposed to public policy.'
  },
  {
    id: 'ica-sec-27',
    act: 'Indian Contract Act 1872',
    section: 'Section 27',
    title: 'Agreement in restraint of trade void',
    summary: 'Any agreement restricting someone from exercising a lawful profession or trade is void.',
    keywords: ['restraint of trade', 'non-compete', 'employment', 'profession', 'business', 'void', 'goodwill', 'restriction'],
    fullText: 'Every agreement by which anyone is restrained from exercising a lawful profession, trade or business of any kind, is to that extent void. Exception: One who sells the goodwill of a business may agree with the buyer to refrain from carrying on a similar business, within specified local limits, so long as the buyer carries on a like business therein.'
  },
  {
    id: 'ica-sec-73',
    act: 'Indian Contract Act 1872',
    section: 'Section 73',
    title: 'Compensation for breach of contract',
    summary: 'Party suffering from breach is entitled to compensation for direct damages, not remote/indirect losses.',
    keywords: ['breach', 'compensation', 'damages', 'loss', 'liability', 'indirect loss', 'consequential', 'remote'],
    fullText: 'When a contract has been broken, the party who suffers by such breach is entitled to receive, from the party who has broken the contract, compensation for any loss or damage caused to him thereby, which naturally arose in the usual course of things from such breach, or which the parties knew, when they made the contract, to be likely to result from the breach of it. Such compensation is not to be given for any remote and indirect loss or damage sustained by reason of the breach.'
  },
  {
    id: 'ica-sec-124',
    act: 'Indian Contract Act 1872',
    section: 'Section 124',
    title: 'Contract of Indemnity',
    summary: 'A contract to save the other party from loss caused by the promisor or any other person.',
    keywords: ['indemnity', 'loss', 'liability', 'save harmless', 'indemnify', 'promisor', 'promisee', 'reimbursement'],
    fullText: 'A contract by which one party promises to save the other from loss caused to him by the conduct of the promisor himself, or by the conduct of any other person, is called a "contract of indemnity".'
  },

  // ==========================================
  // 3. Central Goods and Services Tax (CGST) Act 2017
  // ==========================================
  {
    id: 'cgst-sec-16',
    act: 'CGST Act 2017',
    section: 'Section 16',
    title: 'Eligibility and conditions for taking input tax credit',
    summary: 'Conditions for claiming ITC include possessing a tax invoice, receiving goods/services, and tax being paid to govt.',
    keywords: ['input tax credit', 'itc', 'tax invoice', 'gst', 'tax paid', 'return', 'eligibility', 'goods and services'],
    fullText: 'Every registered person shall be entitled to take credit of input tax charged on any supply of goods or services or both which are used or intended to be used in the course or furtherance of his business. Conditions for ITC: (a) possession of a tax invoice or debit note issued by a supplier registered under this Act; (b) receipt of the goods or services or both; (c) the tax charged in respect of such supply has been actually paid to the Government; and (d) he has furnished the return under section 39.'
  },
  {
    id: 'cgst-sec-31',
    act: 'CGST Act 2017',
    section: 'Section 31',
    title: 'Tax Invoice',
    summary: 'A registered person supplying taxable goods/services must issue a tax invoice showing description, quantity, and value.',
    keywords: ['invoice', 'tax invoice', 'gstin', 'billing', 'supply', 'receipt', 'bill of supply', 'taxable value'],
    fullText: 'A registered person supplying taxable goods shall, before or at the time of removal of goods or delivery of goods, issue a tax invoice showing the description, quantity and value of goods, the tax charged thereon and such other particulars as may be prescribed. For services, the invoice must be issued within a prescribed period.'
  },

  // ==========================================
  // 4. Information Technology (IT) Act 2000
  // ==========================================
  {
    id: 'ita-sec-10a',
    act: 'IT Act 2000',
    section: 'Section 10A',
    title: 'Validity of contracts formed through electronic means',
    summary: 'Electronic contracts are valid and enforceable.',
    keywords: ['electronic contract', 'e-contract', 'digital', 'enforceability', 'electronic means', 'communication', 'acceptance', 'validity'],
    fullText: 'Where in a contract formation, the communication of proposals, the acceptance of proposals, the revocation of proposals and acceptances, as the case may be, are expressed in electronic form or by means of an electronic record, such contract shall not be deemed to be unenforceable solely on the ground that such electronic form or means was used for that purpose.'
  },
  {
    id: 'ita-sec-43a',
    act: 'IT Act 2000',
    section: 'Section 43A',
    title: 'Compensation for failure to protect data',
    summary: 'Body corporates handling sensitive personal data must implement reasonable security practices, else pay compensation.',
    keywords: ['sensitive personal data', 'spdi', 'security practices', 'compensation', 'negligence', 'data protection', 'wrongful loss', 'body corporate', 'liability'],
    fullText: 'Where a body corporate, possessing, dealing or handling any sensitive personal data or information in a computer resource which it owns, controls or operates, is negligent in implementing and maintaining reasonable security practices and procedures and thereby causes wrongful loss or wrongful gain to any person, such body corporate shall be liable to pay damages by way of compensation to the person so affected.'
  },

  // ==========================================
  // 5. Arbitration and Conciliation Act 1996
  // ==========================================
  {
    id: 'aca-sec-7',
    act: 'Arbitration and Conciliation Act 1996',
    section: 'Section 7',
    title: 'Arbitration agreement',
    summary: 'An arbitration agreement must be in writing to submit present or future disputes to arbitration.',
    keywords: ['arbitration', 'dispute resolution', 'agreement in writing', 'arbitrator', 'tribunal', 'legal relationship', 'disputes', 'clause'],
    fullText: 'An arbitration agreement means an agreement by the parties to submit to arbitration all or certain disputes which have arisen or which may arise between them in respect of a defined legal relationship, whether contractual or not. An arbitration agreement may be in the form of an arbitration clause in a contract or in the form of a separate agreement. An arbitration agreement shall be in writing.'
  },
  {
    id: 'aca-sec-11',
    act: 'Arbitration and Conciliation Act 1996',
    section: 'Section 11',
    title: 'Appointment of arbitrators',
    summary: 'Parties are free to agree on a procedure for appointing the arbitrator(s).',
    keywords: ['appointment', 'arbitrator', 'sole arbitrator', 'panel', 'dispute', 'procedure', 'supreme court', 'high court', 'institution'],
    fullText: 'A person of any nationality may be an arbitrator, unless otherwise agreed by the parties. The parties are free to agree on a procedure for appointing the arbitrator or arbitrators. Failing any agreement, in an arbitration with three arbitrators, each party shall appoint one arbitrator, and the two appointed arbitrators shall appoint the third arbitrator who shall act as the presiding arbitrator.'
  },

  // ==========================================
  // 6. Labour Codes 2020 (Wages, OSH, IR, SS)
  // ==========================================
  {
    id: 'lc-wages-sec-17',
    act: 'Code on Wages 2020',
    section: 'Section 17',
    title: 'Payment of wages',
    summary: 'Wages must be paid in current coin, currency notes, by cheque, by crediting the bank account, or electronic mode.',
    keywords: ['wages', 'payment', 'salary', 'bank account', 'electronic', 'cheque', 'employer', 'employee', 'deductions'],
    fullText: 'All wages shall be paid in current coin or currency notes or by cheque or by crediting the wages in the bank account of the employee or by the electronic mode: Provided that the appropriate Government may, by notification, specify the industrial or other establishment, the employer of which shall pay to every person employed in such establishment, the wages only by cheque or by crediting the wages in his bank account.'
  },
  {
    id: 'lc-osh-sec-25',
    act: 'OSH Code 2020',
    section: 'Section 25',
    title: 'Working hours and leave',
    summary: 'No worker shall be required or allowed to work in an establishment for more than eight hours in a day.',
    keywords: ['working hours', 'overtime', 'leave', 'holidays', 'shifts', 'maximum hours', 'spread over', 'rest interval'],
    fullText: 'No worker shall be required or allowed to work, in any establishment or class of establishment for more than eight hours in a day or forty-eight hours in a week. The period of work of a worker shall be so arranged that inclusive of his intervals for rest, it shall not spread over for more than twelve hours in a day.'
  },

  // ==========================================
  // 7. Factories Act 1948
  // ==========================================
  {
    id: 'fa-sec-51',
    act: 'Factories Act 1948',
    section: 'Section 51 & 54',
    title: 'Weekly and Daily Working Hours',
    summary: 'Maximum 48 hours a week and 9 hours a day for adult workers in a factory.',
    keywords: ['factory', 'working hours', 'adult worker', 'maximum hours', 'weekly hours', 'daily hours', 'overtime'],
    fullText: 'Section 51: No adult worker shall be required or allowed to work in a factory for more than forty-eight hours in any week. Section 54: Subject to the provisions of section 51, no adult worker shall be required or allowed to work in a factory for more than nine hours in any day.'
  },

  // ==========================================
  // 8. Consumer Protection Act 2019
  // ==========================================
  {
    id: 'cpa-sec-2-47',
    act: 'Consumer Protection Act 2019',
    section: 'Section 2(47)',
    title: 'Unfair Trade Practice',
    summary: 'Defines unfair trade practices including false representation of standards, misleading ads, and unfair contracts.',
    keywords: ['unfair trade practice', 'consumer', 'misleading', 'false representation', 'deceptive', 'advertisement', 'warranty', 'guarantee', 'unfair contract'],
    fullText: '"Unfair trade practice" means a trade practice which, for the purpose of promoting the sale, use or supply of any goods or for the provision of any service, adopts any unfair method or unfair or deceptive practice including: making any statement which falsely represents that the goods are of a particular standard, quality, quantity, grade, composition, style or model; falsely represents that the services are of a particular standard, quality or grade; etc.'
  },
  {
    id: 'cpa-sec-84',
    act: 'Consumer Protection Act 2019',
    section: 'Section 84',
    title: 'Liability of Product Manufacturer',
    summary: 'Manufacturers are liable for harm caused by defective products.',
    keywords: ['product liability', 'manufacturer', 'defect', 'harm', 'injury', 'compensation', 'design defect', 'manufacturing defect', 'warning'],
    fullText: 'A product manufacturer shall be liable in a product liability action, if— (a) the product contains a manufacturing defect; or (b) the product is defective in design; or (c) there is a deviation from manufacturing specifications; or (d) the product does not conform to the express warranty; or (e) the product fails to contain adequate instructions of correct usage to prevent any harm or any warning regarding improper or incorrect usage.'
  }
];
