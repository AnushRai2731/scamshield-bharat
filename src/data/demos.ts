import type { DemoCase } from '../types'

export const demoCases: DemoCase[] = [
  { id: 'fastag', label: 'FASTag Scam', eyebrow: 'Payment pressure', description: 'A fake suspension notice that demands a tiny “verification” payment.', input_type: 'text', preview: 'Your FASTag account will be suspended today. Pay ₹20 immediately using the link below.', risk: 'HIGH', color: 'bg-orange-50 text-orange-700' },
  { id: 'kyc', label: 'Fake KYC', eyebrow: 'Impersonation', description: 'A message designed to rush a user into “updating” account details.', input_type: 'text', preview: 'Your KYC has expired. Verify your details now to avoid account suspension.', risk: 'HIGH', color: 'bg-red-50 text-red-700' },
  { id: 'otp', label: 'OTP Call', eyebrow: 'Account takeover', description: 'A voice scam that asks for a one-time passcode under false urgency.', input_type: 'audio', preview: 'A caller claims to be support and asks for the OTP sent to your phone.', risk: 'CRITICAL', color: 'bg-red-50 text-red-700' },
  { id: 'delivery', label: 'Delivery Refund', eyebrow: 'Refund trap', description: 'A fake delivery refund flow that redirects the user to a payment link.', input_type: 'text', preview: 'Your parcel could not be delivered. Confirm your refund using this link.', risk: 'HIGH', color: 'bg-orange-50 text-orange-700' },
  { id: 'normal', label: 'Normal Message', eyebrow: 'Everyday message', description: 'A routine delivery update with no request for credentials or money.', input_type: 'text', preview: 'Your order is arriving tomorrow. Track it in the official shopping app.', risk: 'LOW', color: 'bg-emerald-50 text-emerald-700' },
  { id: 'inconclusive', label: 'Inconclusive Message', eyebrow: 'Needs context', description: 'A short message where there is not enough evidence to make a confident call.', input_type: 'text', preview: 'Please call me when you are free.', risk: 'INCONCLUSIVE', color: 'bg-slate-100 text-slate-600' },
]
