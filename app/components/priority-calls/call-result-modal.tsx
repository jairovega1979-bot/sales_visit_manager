
'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Phone, 
  PhoneOff, 
  Clock, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  User,
  MessageSquare
} from 'lucide-react';

export type CallResult = 
  | 'CONNECTED_APPOINTMENT' 
  | 'CONNECTED_NO_INTEREST' 
  | 'CONNECTED_CALLBACK_LATER' 
  | 'VOICEMAIL_LEFT' 
  | 'NO_ANSWER' 
  | 'WRONG_NUMBER' 
  | 'NUMBER_UNAVAILABLE';

interface CallResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveResult: (result: CallResult, notes: string) => void;
  customerName: string;
  customerPhone?: string;
}

const callResultOptions = [
  {
    value: 'CONNECTED_APPOINTMENT' as const,
    label: 'Connecté - RDV pris',
    description: 'Contact réussi avec prise de rendez-vous',
    icon: <CheckCircle className="h-5 w-5 text-green-600" />,
    color: 'bg-green-50 border-green-200 text-green-800',
    badgeColor: 'bg-green-100 text-green-800'
  },
  {
    value: 'CONNECTED_NO_INTEREST' as const,
    label: 'Connecté - Pas intéressé',
    description: 'Contact réussi mais client non intéressé',
    icon: <XCircle className="h-5 w-5 text-red-600" />,
    color: 'bg-red-50 border-red-200 text-red-800',
    badgeColor: 'bg-red-100 text-red-800'
  },
  {
    value: 'CONNECTED_CALLBACK_LATER' as const,
    label: 'Connecté - Rappeler plus tard',
    description: 'Contact réussi, demande de rappel ultérieur',
    icon: <Clock className="h-5 w-5 text-orange-600" />,
    color: 'bg-orange-50 border-orange-200 text-orange-800',
    badgeColor: 'bg-orange-100 text-orange-800'
  },
  {
    value: 'VOICEMAIL_LEFT' as const,
    label: 'Message laissé',
    description: 'Répondeur - message vocal laissé',
    icon: <MessageSquare className="h-5 w-5 text-blue-600" />,
    color: 'bg-blue-50 border-blue-200 text-blue-800',
    badgeColor: 'bg-blue-100 text-blue-800'
  },
  {
    value: 'NO_ANSWER' as const,
    label: 'Pas de réponse',
    description: 'Sonnerie sans réponse, pas de répondeur',
    icon: <PhoneOff className="h-5 w-5 text-gray-600" />,
    color: 'bg-gray-50 border-gray-200 text-gray-800',
    badgeColor: 'bg-gray-100 text-gray-800'
  },
  {
    value: 'WRONG_NUMBER' as const,
    label: 'Mauvais numéro',
    description: 'Numéro erroné ou attribué à quelqu\'un d\'autre',
    icon: <AlertCircle className="h-5 w-5 text-yellow-600" />,
    color: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    badgeColor: 'bg-yellow-100 text-yellow-800'
  },
  {
    value: 'NUMBER_UNAVAILABLE' as const,
    label: 'Numéro non disponible',
    description: 'Ligne occupée, hors service ou non attribuée',
    icon: <PhoneOff className="h-5 w-5 text-purple-600" />,
    color: 'bg-purple-50 border-purple-200 text-purple-800',
    badgeColor: 'bg-purple-100 text-purple-800'
  }
];

export function CallResultModal({ 
  isOpen, 
  onClose, 
  onSaveResult, 
  customerName, 
  customerPhone 
}: CallResultModalProps) {
  const [selectedResult, setSelectedResult] = useState<CallResult | null>(null);
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    if (selectedResult) {
      onSaveResult(selectedResult, notes);
      setSelectedResult(null);
      setNotes('');
      onClose();
    }
  };

  const handleCancel = () => {
    setSelectedResult(null);
    setNotes('');
    onClose();
  };

  const selectedOption = callResultOptions.find(opt => opt.value === selectedResult);

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-brand-navy flex items-center gap-2">
            <Phone className="h-5 w-5 text-blue-600" />
            Résultat de l'Appel
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Info */}
          <Card className="bg-brand-sky/10 border-brand-sky/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-brand-navy" />
                <div>
                  <h3 className="font-semibold text-brand-navy">{customerName}</h3>
                  {customerPhone && (
                    <p className="text-sm text-brand-navy/70 flex items-center gap-1 mt-1">
                      <Phone className="h-3 w-3" />
                      {customerPhone}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Result Selection */}
          <div>
            <Label className="text-base font-semibold mb-4 block">
              Sélectionnez le résultat de votre appel:
            </Label>
            <div className="grid gap-3">
              {callResultOptions.map((option) => (
                <Card 
                  key={option.value}
                  className={`cursor-pointer transition-all ${
                    selectedResult === option.value 
                      ? `${option.color} ring-2 ring-offset-2 ring-blue-500` 
                      : 'hover:bg-gray-50 border-gray-200'
                  }`}
                  onClick={() => setSelectedResult(option.value)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {option.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">{option.label}</span>
                          {selectedResult === option.value && (
                            <Badge className={option.badgeColor}>Sélectionné</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{option.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Selected Result Summary */}
          {selectedResult && selectedOption && (
            <Card className={`${selectedOption.color} border-2`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  {selectedOption.icon}
                  <span className="font-semibold">Résultat sélectionné:</span>
                </div>
                <p className="text-sm">{selectedOption.label} - {selectedOption.description}</p>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          <div>
            <Label htmlFor="call-notes" className="text-base font-semibold">
              Notes complémentaires (optionnel)
            </Label>
            <Textarea
              id="call-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ajoutez des détails sur l'appel, prochaines étapes, remarques importantes..."
              className="mt-2 min-h-[100px]"
              maxLength={500}
            />
            <div className="text-xs text-gray-500 mt-1">
              {notes.length}/500 caractères
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={handleCancel}>
              Annuler
            </Button>
            <Button 
              onClick={handleSave}
              disabled={!selectedResult}
              className="bg-brand-navy hover:bg-brand-blue"
            >
              Enregistrer le Résultat
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
