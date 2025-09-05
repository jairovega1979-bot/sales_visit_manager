
'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  Phone, 
  Target, 
  Clock, 
  TrendingUp,
  Users,
  AlertTriangle,
  Info,
  Bell,
  Mail,
  Calendar
} from 'lucide-react';
import { ManagerAlertSettings } from '@/lib/priority-calls-algorithm';

interface ManagerSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: { 
    dailyCallsTarget: number;
    managerAlertSettings: ManagerAlertSettings;
  }) => void;
  currentSettings: { 
    dailyCallsTarget: number;
    managerAlertSettings: ManagerAlertSettings;
  };
}

export function ManagerSettingsModal({ 
  isOpen, 
  onClose, 
  onSave, 
  currentSettings 
}: ManagerSettingsModalProps) {
  const [dailyCallsTarget, setDailyCallsTarget] = useState(currentSettings.dailyCallsTarget);
  const [alertSettings, setAlertSettings] = useState<ManagerAlertSettings>(currentSettings.managerAlertSettings);

  useEffect(() => {
    setDailyCallsTarget(currentSettings.dailyCallsTarget);
    setAlertSettings(currentSettings.managerAlertSettings);
  }, [currentSettings]);

  const handleSave = () => {
    if (dailyCallsTarget >= 1 && dailyCallsTarget <= 50) {
      onSave({ 
        dailyCallsTarget,
        managerAlertSettings: alertSettings
      });
      onClose();
    }
  };

  const handleCancel = () => {
    setDailyCallsTarget(currentSettings.dailyCallsTarget);
    setAlertSettings(currentSettings.managerAlertSettings);
    onClose();
  };

  const handleAlertSettingChange = (key: keyof ManagerAlertSettings, value: any) => {
    setAlertSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getRecommendation = (value: number) => {
    if (value <= 10) return { text: "Idéal pour petites équipes", color: "text-green-600" };
    if (value <= 20) return { text: "Recommandé pour la plupart des équipes", color: "text-blue-600" };
    if (value <= 30) return { text: "Pour équipes très actives", color: "text-orange-600" };
    return { text: "Attention: charge de travail élevée", color: "text-red-600" };
  };

  const recommendation = getRecommendation(dailyCallsTarget);

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-brand-navy flex items-center gap-2">
            <Settings className="h-5 w-5 text-blue-600" />
            Configuration Manager - Module "J'attendais votre appel"
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="calls" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calls" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Appels Quotidiens
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Alertes Manager
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calls" className="space-y-6">
            {/* Current Configuration */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Target className="h-4 w-4 text-blue-600" />
                  Configuration Actuelle - Appels
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-700">Appels quotidiens recommandés:</span>
                  <Badge className="bg-blue-100 text-blue-800 text-base font-bold">
                    {currentSettings.dailyCallsTarget}
                  </Badge>
                </div>
              </CardContent>
            </Card>

          {/* Daily Calls Target Setting */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="daily-calls" className="text-base font-semibold flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Nombre d'appels recommandés par jour
              </Label>
              <div className="mt-2 space-y-3">
                <Input
                  id="daily-calls"
                  type="number"
                  min="1"
                  max="50"
                  value={dailyCallsTarget}
                  onChange={(e) => setDailyCallsTarget(parseInt(e.target.value) || 1)}
                  className="text-center text-lg font-semibold"
                />
                
                <div className="flex items-center justify-center">
                  <span className={`text-sm font-medium ${recommendation.color}`}>
                    {recommendation.text}
                  </span>
                </div>
              </div>
            </div>

            {/* Range Indicator */}
            <Card className="bg-gray-50">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <Info className="h-4 w-4 text-gray-600" />
                    Recommandations d'Usage
                  </h4>
                  <div className="text-xs space-y-1 text-gray-600">
                    <div className="flex justify-between">
                      <span>• 1-10 appels:</span>
                      <span className="text-green-600 font-medium">Équipes débutantes</span>
                    </div>
                    <div className="flex justify-between">
                      <span>• 11-20 appels:</span>
                      <span className="text-blue-600 font-medium">Standard recommandé</span>
                    </div>
                    <div className="flex justify-between">
                      <span>• 21-30 appels:</span>
                      <span className="text-orange-600 font-medium">Équipes expérimentées</span>
                    </div>
                    <div className="flex justify-between">
                      <span>• 31+ appels:</span>
                      <span className="text-red-600 font-medium">Charge intensive</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Impact Preview */}
          {dailyCallsTarget !== currentSettings.dailyCallsTarget && (
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-yellow-800">Changement détecté</p>
                    <p className="text-yellow-700">
                      La liste des appels sera mise à jour avec {dailyCallsTarget} recommandations 
                      quotidiennes au lieu de {currentSettings.dailyCallsTarget}.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Statistics Info */}
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="font-semibold text-green-800 text-sm">Impact Estimé</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">
                    ~{Math.round(dailyCallsTarget * 0.3)}
                  </div>
                  <div className="text-green-700">Connexions/jour</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">
                    ~{Math.round(dailyCallsTarget * 0.15)}
                  </div>
                  <div className="text-green-700">RDV potentiels</div>
                </div>
              </div>
            </CardContent>
          </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            {/* Current Alert Configuration */}
            <Card className="bg-orange-50 border-orange-200">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Bell className="h-4 w-4 text-orange-600" />
                  Configuration Actuelle - Alertes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-orange-700">Alertes activées:</span>
                    <Badge className={`${currentSettings.managerAlertSettings.enableAlerts ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {currentSettings.managerAlertSettings.enableAlerts ? 'Oui' : 'Non'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-orange-700">Alerter après:</span>
                    <Badge className="bg-orange-100 text-orange-800">
                      {currentSettings.managerAlertSettings.alertAfterDays} jours
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Alert Settings */}
            <div className="space-y-6">
              {/* Enable/Disable Alerts */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    Activation des Alertes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enable-alerts" className="text-sm font-medium">
                      Activer les alertes pour clients non contactés
                    </Label>
                    <Switch
                      id="enable-alerts"
                      checked={alertSettings.enableAlerts}
                      onCheckedChange={(checked) => handleAlertSettingChange('enableAlerts', checked)}
                    />
                  </div>
                  <p className="text-xs text-gray-600">
                    Recevez des notifications lorsque des clients prioritaires ne sont pas contactés pendant plusieurs jours.
                  </p>
                </CardContent>
              </Card>

              {alertSettings.enableAlerts && (
                <>
                  {/* Alert Timing */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-600" />
                        Timing des Alertes
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="alert-after-days" className="text-sm font-medium">
                          Alerter après combien de jours sans contact
                        </Label>
                        <Select
                          value={alertSettings.alertAfterDays.toString()}
                          onValueChange={(value) => handleAlertSettingChange('alertAfterDays', parseInt(value))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 jour</SelectItem>
                            <SelectItem value="2">2 jours (recommandé)</SelectItem>
                            <SelectItem value="3">3 jours</SelectItem>
                            <SelectItem value="4">4 jours</SelectItem>
                            <SelectItem value="5">5 jours</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="alert-frequency" className="text-sm font-medium">
                          Fréquence des rappels d'alerte
                        </Label>
                        <Select
                          value={alertSettings.alertFrequency}
                          onValueChange={(value: any) => handleAlertSettingChange('alertFrequency', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="DAILY">Tous les jours</SelectItem>
                            <SelectItem value="EVERY_2_DAYS">Tous les 2 jours</SelectItem>
                            <SelectItem value="WEEKLY">Une fois par semaine</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Email Notifications */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Mail className="h-4 w-4 text-green-600" />
                        Notifications Email
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="email-notifications" className="text-sm font-medium">
                          Envoyer des notifications par email
                        </Label>
                        <Switch
                          id="email-notifications"
                          checked={alertSettings.emailNotifications}
                          onCheckedChange={(checked) => handleAlertSettingChange('emailNotifications', checked)}
                        />
                      </div>

                      {alertSettings.emailNotifications && (
                        <div className="space-y-2">
                          <Label htmlFor="manager-email" className="text-sm font-medium">
                            Email du manager
                          </Label>
                          <Input
                            id="manager-email"
                            type="email"
                            value={alertSettings.managerEmail || ''}
                            onChange={(e) => handleAlertSettingChange('managerEmail', e.target.value)}
                            placeholder="manager@company.ch"
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </>
              )}

              {/* Preview of Alert Rules */}
              <Card className="bg-yellow-50 border-yellow-200">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Info className="h-4 w-4 text-yellow-600" />
                    Aperçu des Règles d'Alerte
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  {alertSettings.enableAlerts ? (
                    <>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Les clients non contactés seront maintenus dans la liste pendant <strong>5 jours</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span>Alerte manager après <strong>{alertSettings.alertAfterDays} jour(s)</strong> sans contact</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Rappels <strong>{alertSettings.alertFrequency === 'DAILY' ? 'quotidiens' : alertSettings.alertFrequency === 'EVERY_2_DAYS' ? 'tous les 2 jours' : 'hebdomadaires'}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span>L'urgence des clients persistants est <strong>automatiquement escaladée</strong></span>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center gap-2 text-gray-600">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <span>Alertes désactivées - Seules les recommandations quotidiennes seront générées</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={handleCancel}>
              Annuler
            </Button>
            <Button 
              onClick={handleSave}
              disabled={dailyCallsTarget < 1 || dailyCallsTarget > 50 || dailyCallsTarget === currentSettings.dailyCallsTarget}
              className="bg-brand-navy hover:bg-brand-blue"
            >
              Sauvegarder
            </Button>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
