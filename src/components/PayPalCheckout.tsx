import { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CreditCard, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PAYPAL_CONFIG, PAYMENT_AMOUNTS, PAYMENT_DESCRIPTIONS } from '@/config/paypal';

interface PayPalCheckoutProps {
  subscriptionType: 'pdf' | 'annuale';
  userData: {
    name: string;
    email: string;
  };
  onPaymentSuccess: (paymentData: any) => void;
  onPaymentError: (error: any) => void;
  onCancel: () => void;
}

const PayPalButtonWrapper = ({ 
  subscriptionType, 
  userData, 
  onPaymentSuccess, 
  onPaymentError, 
  onCancel 
}: PayPalCheckoutProps) => {
  const [{ isPending }] = usePayPalScriptReducer();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const amount = subscriptionType === 'pdf' ? PAYMENT_AMOUNTS.PDF : PAYMENT_AMOUNTS.SUBSCRIPTION;
  const description = subscriptionType === 'pdf' ? PAYMENT_DESCRIPTIONS.PDF : PAYMENT_DESCRIPTIONS.SUBSCRIPTION;

  const createOrder = (data: any, actions: any) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            currency_code: PAYPAL_CONFIG.currency,
            value: amount.toFixed(2),
          },
          description: description,
          custom_id: `${subscriptionType}_${userData.email}`,
        },
      ],
      application_context: {
        brand_name: 'D-DAND',
        landing_page: 'NO_PREFERENCE',
        user_action: 'PAY_NOW',
      },
    });
  };

  const onApprove = async (data: any, actions: any) => {
    try {
      setIsProcessing(true);
      
      const details = await actions.order.capture();
      
      console.log('Payment approved:', details);
      
      toast({
        title: "Pagamento Completato!",
        description: `Il pagamento di €${amount} è stato elaborato con successo.`,
      });
      
      onPaymentSuccess({
        orderId: details.id,
        status: details.status,
        amount: amount,
        subscriptionType,
        userData,
        paymentDetails: details,
      });
      
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Errore nel Pagamento",
        description: "Si è verificato un errore durante l'elaborazione del pagamento.",
        variant: "destructive",
      });
      onPaymentError(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const onError = (err: any) => {
    console.error('PayPal error:', err);
    toast({
      title: "Errore PayPal",
      description: "Si è verificato un errore con PayPal. Riprova più tardi.",
      variant: "destructive",
    });
    onPaymentError(err);
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        <span>Caricamento PayPal...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PayPalButtons
        createOrder={createOrder}
        onApprove={onApprove}
        onError={onError}
        onCancel={onCancel}
        disabled={isProcessing}
        style={{
          layout: 'vertical',
          color: 'blue',
          shape: 'rect',
          label: 'paypal',
        }}
      />
      
      {isProcessing && (
        <div className="flex items-center justify-center py-4 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          <span>Elaborazione pagamento...</span>
        </div>
      )}
    </div>
  );
};

export const PayPalCheckout = (props: PayPalCheckoutProps) => {
  const { subscriptionType, userData } = props;
  const amount = subscriptionType === 'pdf' ? PAYMENT_AMOUNTS.PDF : PAYMENT_AMOUNTS.SUBSCRIPTION;
  const description = subscriptionType === 'pdf' ? PAYMENT_DESCRIPTIONS.PDF : PAYMENT_DESCRIPTIONS.SUBSCRIPTION;

  return (
    <PayPalScriptProvider options={PAYPAL_CONFIG}>
      <div className="w-full">
        <div className="text-center mb-4">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <CreditCard className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h3 className="text-xl font-semibold">
            {subscriptionType === 'pdf' ? 'Acquisto Kit D-DAND PDF' : 'Abbonamento Annuale'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Importo:</span>
              <span className="text-2xl font-bold">€{amount}</span>
            </div>
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>Cliente:</span>
              <span>{userData.name}</span>
            </div>
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>Email:</span>
              <span>{userData.email}</span>
            </div>
          </div>
          
          <div className="text-center">
            <Badge variant="outline" className="mb-2">
              Pagamento Sicuro con PayPal
            </Badge>
            <p className="text-xs text-muted-foreground">
              Il tuo pagamento è protetto da PayPal. Puoi pagare con carta di credito o account PayPal.
            </p>
          </div>
          
          <PayPalButtonWrapper {...props} />
        </div>
      </div>
    </PayPalScriptProvider>
  );
};
