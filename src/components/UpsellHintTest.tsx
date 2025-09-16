import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { UpsellHint } from './ui/upsell-hint';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

export function UpsellHintTest() {
  const [nearbySlotExists, setNearbySlotExists] = useState(true);
  const [clicked, setClicked] = useState(false);

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-2">Тест UpsellHint компонента</h1>
        <p className="text-muted-foreground">
          Проверка работы компонента для показа дополнительных опций
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Управление состоянием</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Button
              variant={nearbySlotExists ? "default" : "outline"}
              size="sm"
              onClick={() => setNearbySlotExists(true)}
            >
              Слот доступен
            </Button>
            <Button
              variant={!nearbySlotExists ? "default" : "outline"}
              size="sm"
              onClick={() => setNearbySlotExists(false)}
            >
              Слот недоступен
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              nearbySlotExists: {nearbySlotExists.toString()}
            </Badge>
            {clicked && (
              <Badge variant="secondary">
                Клик зарегистрирован!
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Компонент UpsellHint</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 border rounded-lg bg-muted/30">
            <p className="text-sm text-muted-foreground mb-3">
              {nearbySlotExists 
                ? "Компонент должен отображаться:" 
                : "Компонент скрыт (nearbySlotExists = false):"}
            </p>
            
            <UpsellHint
              nearbySlotExists={nearbySlotExists}
              additionalMinutes={15}
              discountPercent={10}
              onClick={() => setClicked(!clicked)}
            />
            
            {!nearbySlotExists && (
              <p className="text-xs text-muted-foreground mt-2">
                Компонент возвращает null и не рендерится
              </p>
            )}
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-sm">Состояние компонента:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• nearbySlotExists: {nearbySlotExists.toString()}</li>
              <li>• additionalMinutes: 15</li>
              <li>• discountPercent: 10</li>
              <li>• onClick: {clicked ? "сработал" : "ожидает клика"}</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Варианты использования</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-sm mb-2">Стандартный вариант (+15 мин, -10%)</h4>
              <UpsellHint
                nearbySlotExists={true}
                additionalMinutes={15}
                discountPercent={10}
                onClick={() => console.log('Standard upsell clicked')}
              />
            </div>

            <div>
              <h4 className="font-medium text-sm mb-2">Большая скидка (+30 мин, -20%)</h4>
              <UpsellHint
                nearbySlotExists={true}
                additionalMinutes={30}
                discountPercent={20}
                onClick={() => console.log('Big discount upsell clicked')}
              />
            </div>

            <div>
              <h4 className="font-medium text-sm mb-2">Малая скидка (+10 мин, -5%)</h4>
              <UpsellHint
                nearbySlotExists={true}
                additionalMinutes={10}
                discountPercent={5}
                onClick={() => console.log('Small discount upsell clicked')}
              />
            </div>

            <div>
              <h4 className="font-medium text-sm mb-2">Недоступный слот (не отображается)</h4>
              <UpsellHint
                nearbySlotExists={false}
                additionalMinutes={15}
                discountPercent={10}
                onClick={() => console.log('This should not be clickable')}
              />
              <p className="text-xs text-muted-foreground">
                ☝️ Этот компонент не отображается, так как nearbySlotExists = false
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}