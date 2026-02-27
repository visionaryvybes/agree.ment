'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Scale, FileText, AlertTriangle, Globe, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const suggestedQuestions = [
  { icon: Scale, text: 'What are my rights if someone defaults on a personal loan in Kenya?', category: 'Legal Rights' },
  { icon: FileText, text: 'Draft a demand letter for an unpaid debt of $2,000', category: 'Document' },
  { icon: AlertTriangle, text: 'How do I file a small claims court case in the US?', category: 'Legal Action' },
  { icon: Globe, text: 'What interest rate can I legally charge on a personal loan in Nigeria?', category: 'Regulation' },
  { icon: FileText, text: 'Review my contract clauses for any risky terms', category: 'Review' },
  { icon: Scale, text: 'Explain the difference between arbitration and mediation', category: 'Education' },
];

// Simulated AI responses based on keywords
function getAIResponse(question: string): string {
  const q = question.toLowerCase();

  if (q.includes('default') || q.includes('unpaid') || q.includes('not paying')) {
    return `**Dealing with Default on Personal Loans**

When someone defaults on a personal loan, here are the legal steps you can take:

**1. Document Everything**
Keep records of the original agreement, all payments made, and any communication about the debt.

**2. Send a Formal Demand Letter**
Before legal action, send a written demand letter stating:
- The amount owed
- The original agreement terms
- A deadline for payment (usually 14-30 days)
- Consequences of non-payment

**3. Mediation**
Many jurisdictions require or encourage mediation before court action. This is faster and cheaper than litigation.

**4. Small Claims Court**
If the amount is within your jurisdiction's small claims limit:
- **Kenya**: Magistrate's Court handles claims up to KES 1,000,000
- **Nigeria**: Magistrate's Court for claims under NGN 5,000,000
- **USA**: Varies by state ($5,000-$25,000 typically)
- **UK**: Small Claims Track for claims under £10,000

**5. Evidence You'll Need**
- The signed agreement or written communication showing the arrangement
- Payment records (receipts, bank transfers, mobile money records)
- The demand letter and proof it was delivered
- Any WhatsApp messages or texts discussing the loan

**Important**: Statute of limitations varies by jurisdiction. In most countries, you have 3-6 years to bring a claim for breach of contract.

*This is general legal information, not legal advice. Consult a qualified attorney in your jurisdiction for specific guidance.*`;
  }

  if (q.includes('demand letter')) {
    return `**Sample Demand Letter Structure**

Here's how to structure an effective demand letter:

---

**[Your Name]**
**[Your Address]**
**[Date]**

**[Debtor's Name]**
**[Debtor's Address]**

**RE: Demand for Payment - Outstanding Debt of [Amount]**

Dear [Name],

This letter serves as a formal demand for payment of the outstanding sum of **[Amount]** which became due on **[Date]** under our agreement dated **[Original Date]**.

**Background:**
On [Date], you and I entered into an agreement whereby I loaned you the sum of [Amount]. Under the terms of our agreement, you were to repay [repayment terms]. To date, the following amount remains unpaid: [Amount].

**Demand:**
I hereby demand full payment of **[Amount]** within **14 days** of receipt of this letter, no later than **[Deadline Date]**.

**Consequences:**
Should payment not be received by the above date, I will be forced to pursue all available legal remedies, which may include filing a claim in [Court Name] and seeking recovery of the debt plus any applicable interest and legal costs.

Sincerely,
[Your Name]

---

**Tips:**
- Send via registered mail or email with read receipt
- Keep a copy for your records
- In some jurisdictions, a demand letter is required before filing a lawsuit
- You can use AgreeMint to generate this automatically from your contract

*Would you like me to help generate this from one of your existing contracts?*`;
  }

  if (q.includes('small claims') || q.includes('court') || q.includes('sue')) {
    return `**Filing in Small Claims Court - Step by Step**

**Step 1: Determine Eligibility**
Check your jurisdiction's small claims limit and make sure your claim qualifies.

**Step 2: Send a Demand Letter First**
Most courts expect you to attempt resolution before filing. Send a formal demand letter and wait the specified period (usually 14-30 days).

**Step 3: File the Claim**
- Visit your local court clerk's office or file online (many courts now offer e-filing)
- Fill out the complaint form with:
  - Your name and contact details
  - Defendant's name and address
  - Amount claimed
  - Brief description of the dispute
  - Copies of supporting documents

**Step 4: Pay Filing Fee**
Fees vary:
- USA: $30-$100 depending on state and amount
- UK: £35-£455 depending on amount
- Kenya: Court fees vary by amount claimed
- Nigeria: Filing fees based on claim amount

**Step 5: Serve the Defendant**
The court will issue a summons. You must serve the defendant (methods vary by jurisdiction).

**Step 6: Prepare for the Hearing**
Organize your evidence:
- Original contract/agreement
- Payment records
- Demand letter and proof of delivery
- Communications (texts, emails, WhatsApp)
- Any witness statements

**Step 7: Attend the Hearing**
Present your case clearly. Bring all originals and copies.

*Would you like me to help prepare your case documents from your contracts in AgreeMint?*`;
  }

  if (q.includes('interest rate') || q.includes('usury')) {
    return `**Legal Interest Rate Limits by Jurisdiction**

Interest rate limits (usury laws) vary significantly by country:

**United States** 🇺🇸
- Varies by state: typically 5-25% per year
- Federal preemption applies to some lenders
- Personal loans between individuals generally subject to state usury laws
- Some states have no usury limit for agreed-upon rates

**Nigeria** 🇳🇬
- No specific statutory cap on interest rates for personal loans
- However, unconscionable rates can be challenged in court
- Central Bank sets Monetary Policy Rate (reference rate)
- Courts have struck down rates deemed "unconscionable"

**Kenya** 🇰🇪
- Interest Rate Cap was repealed in 2019
- Currently no statutory cap, but CBK provides guidelines
- Courts may intervene on unconscionable terms

**United Kingdom** 🇬🇧
- No general statutory interest rate cap
- FCA regulates consumer credit (payday loans capped at 0.8% per day)
- Unfair terms provisions may apply

**South Africa** 🇿🇦
- National Credit Act caps rates based on loan type
- Unsecured credit: repo rate × 2.2 + 20% per year
- Short-term loans: 5% per month + initiation fee

**India** 🇮🇳
- No uniform usury law nationwide
- Some states have Money Lenders Acts with caps
- Generally, courts may refuse to enforce unconscionable rates

**Best Practice**: Even where no cap exists, charge a reasonable rate. Courts can void agreements with unconscionable terms.

*Would you like me to update your contract with a jurisdiction-appropriate interest clause?*`;
  }

  if (q.includes('arbitration') || q.includes('mediation')) {
    return `**Arbitration vs. Mediation**

These are both forms of Alternative Dispute Resolution (ADR), but they work very differently:

**Mediation** 🤝
- A neutral mediator helps parties reach their own agreement
- **Non-binding**: Neither party is forced to accept any outcome
- **Collaborative**: Both sides work together toward a solution
- **Cheaper**: Usually $200-$2,000 depending on complexity
- **Faster**: Often resolved in 1-3 sessions
- **Confidential**: Discussions are private
- Best for: Preserving relationships, simple disputes, when parties are willing to compromise

**Arbitration** ⚖️
- An arbitrator hears both sides and makes a decision
- **Binding**: The decision is usually final and enforceable
- **Adversarial**: More like a court trial, but less formal
- **Moderate cost**: $3,000-$10,000+ for complex disputes
- **Faster than court**: Usually 3-6 months vs. 1-3 years
- **Limited appeal**: Very difficult to overturn an arbitrator's decision
- Best for: When parties can't agree, larger amounts, when a clear decision is needed

**In Your Contracts**
I recommend including a dispute resolution clause with this escalation path:
1. **Negotiation** (30 days) → 2. **Mediation** (if negotiation fails) → 3. **Arbitration** (if mediation fails)

This approach is included in all AgreeMint templates and gives both parties the best chance of resolving disputes efficiently.

*Would you like me to add or update the dispute resolution clause in any of your contracts?*`;
  }

  // Default response
  return `Thank you for your question. Here's what I can help with:

**Legal Guidance Areas:**
- Contract law fundamentals for your jurisdiction
- Dispute resolution options and procedures
- Payment default and recovery steps
- Small claims court filing guidance
- Interest rate and usury law information
- Demand letter drafting
- Contract clause review and recommendations

**What I Can Do:**
- Generate jurisdiction-specific contract clauses
- Review your existing contracts for risks
- Guide you through the escalation process
- Help you understand your legal rights and obligations
- Draft formal notices and demand letters

**Important Disclaimer:**
I provide legal information and guidance based on publicly available laws and common legal practices. This is not legal advice, and you should consult with a qualified attorney for specific legal matters.

*Try asking me about a specific legal situation, and I'll provide detailed, jurisdiction-aware guidance.*`;
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking time
    await new Promise(r => setTimeout(r, 1500));

    const response = getAIResponse(messageText);
    const assistantMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, assistantMsg]);
    setIsTyping(false);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-teal-500 rounded-xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">AI Legal Advisor</h1>
            <p className="text-xs text-slate-500">Ask legal questions, get jurisdiction-specific guidance, draft documents</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {messages.length === 0 && (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8 pt-8">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Bot className="w-8 h-8 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">How can I help you today?</h2>
              <p className="text-slate-500">I can help with legal questions, contract reviews, dispute guidance, and more.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {suggestedQuestions.map((q, i) => {
                const Icon = q.icon;
                return (
                  <button key={i} onClick={() => handleSend(q.text)} className="card p-4 text-left hover:border-teal-300 group">
                    <div className="flex items-start gap-3">
                      <Icon className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="badge badge-primary text-xs mb-1">{q.category}</span>
                        <p className="text-sm text-slate-700 group-hover:text-teal-700">{q.text}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-3 max-w-3xl mx-auto ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}
            <div className={`max-w-[80%] rounded-2xl p-4 ${msg.role === 'user' ? 'bg-teal-600 text-white' : 'bg-white border border-slate-200 shadow-sm'}`}>
              <div className={`text-sm whitespace-pre-wrap leading-relaxed ${msg.role === 'user' ? 'text-white' : 'text-slate-700'}`}>
                {msg.content.split('\n').map((line, i) => {
                  if (line.startsWith('**') && line.endsWith('**')) {
                    return <p key={i} className="font-bold mt-2 mb-1">{line.replace(/\*\*/g, '')}</p>;
                  }
                  if (line.startsWith('- ')) {
                    return <p key={i} className="ml-4">{line}</p>;
                  }
                  return <p key={i}>{line}</p>;
                })}
              </div>
              <p className={`text-xs mt-2 ${msg.role === 'user' ? 'text-teal-200' : 'text-slate-400'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 bg-slate-200 rounded-lg flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-slate-600" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 max-w-3xl mx-auto">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-200 bg-white">
        <div className="max-w-3xl mx-auto flex gap-3">
          <input
            className="input flex-1"
            placeholder="Ask a legal question, request a document, or describe your situation..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
          />
          <button onClick={() => handleSend()} disabled={!input.trim() || isTyping} className="btn-primary flex items-center gap-2">
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-slate-400 text-center mt-2">AI provides legal information, not legal advice. Always consult a qualified attorney.</p>
      </div>
    </div>
  );
}
