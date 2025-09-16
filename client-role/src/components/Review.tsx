import React, { useContext, useState } from 'react';
import { ArrowLeft, Star, Send } from 'lucide-react';
import { AppContext, Booking } from '../App';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner@2.0.3';

interface ReviewProps {
  booking: Booking;
}

export function Review({ booking }: ReviewProps) {
  const context = useContext(AppContext);
  if (!context) return null;

  const { language, setCurrentScreen } = context;
  const [rating, setRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const texts = {
    ru: {
      reviewTitle: 'Оцените визит',
      service: 'Услуга',
      provider: 'Поставщик',
      datetime: 'Дата и время',
      rating: 'Оценка',
      selectRating: 'Поставьте оценку от 1 до 5 звёзд',
      tags: 'Что понравилось?',
      quality: 'качество',
      service_tag: 'сервис',
      price: 'цена',
      speed: 'скорость',
      location: 'расположение',
      staff: 'персонал',
      comment: 'Комментарий (необязательно)',
      commentPlaceholder: 'Поделитесь своими впечатлениями...',
      submit: 'Отправить отзыв',
      thankYou: 'Спасибо за отзыв!',
      ratingRequired: 'Пожалуйста, поставьте оценку'
    },
    en: {
      reviewTitle: 'Rate your visit',
      service: 'Service',
      provider: 'Provider',
      datetime: 'Date & Time',
      rating: 'Rating',
      selectRating: 'Rate from 1 to 5 stars',
      tags: 'What did you like?',
      quality: 'quality',
      service_tag: 'service',
      price: 'price',
      speed: 'speed',
      location: 'location',
      staff: 'staff',
      comment: 'Comment (optional)',
      commentPlaceholder: 'Share your impressions...',
      submit: 'Submit Review',
      thankYou: 'Thank you for your feedback!',
      ratingRequired: 'Please provide a rating'
    }
  };

  const t = texts[language];

  const availableTags = [
    t.quality,
    t.service_tag,
    t.price,
    t.speed,
    t.location,
    t.staff
  ];

  const handleBack = () => {
    setCurrentScreen('booking-details');
  };

  const handleRatingSelect = (stars: number) => {
    setRating(stars);
  };

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error(t.ratingRequired);
      return;
    }

    setIsSubmitting(true);
    
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Show success message
    toast.success(t.thankYou);
    
    setIsSubmitting(false);
    
    // Navigate back
    setTimeout(() => {
      setCurrentScreen('my-bookings');
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/50 p-4 pt-16">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-medium">{t.reviewTitle}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-6">
        {/* Booking Summary */}
        <Card className="p-4 bg-card/80 backdrop-blur-sm border-0">
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">{t.service}</p>
              <p className="font-medium">{booking.service.name}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">{t.provider}</p>
              <p className="font-medium">{booking.service.provider}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">{t.datetime}</p>
              <p className="font-medium">{booking.date}, {booking.time} - {booking.endTime}</p>
            </div>
          </div>
        </Card>

        {/* Rating */}
        <Card className="p-6 bg-card/80 backdrop-blur-sm border-0">
          <div className="text-center">
            <h2 className="font-medium mb-2">{t.rating}</h2>
            <p className="text-sm text-muted-foreground mb-6">{t.selectRating}</p>
            
            <div className="flex justify-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((stars) => (
                <button
                  key={stars}
                  onClick={() => handleRatingSelect(stars)}
                  className="p-2 transition-transform hover:scale-110"
                >
                  <Star 
                    className={`w-8 h-8 ${
                      stars <= rating 
                        ? 'fill-yellow-400 text-yellow-400' 
                        : 'text-gray-300'
                    }`} 
                  />
                </button>
              ))}
            </div>
            
            {rating > 0 && (
              <p className="text-sm text-muted-foreground">
                {rating === 1 && 'Очень плохо'}
                {rating === 2 && 'Плохо'}
                {rating === 3 && 'Нормально'}
                {rating === 4 && 'Хорошо'}
                {rating === 5 && 'Отлично'}
              </p>
            )}
          </div>
        </Card>

        {/* Tags */}
        {rating > 0 && (
          <Card className="p-4 bg-card/80 backdrop-blur-sm border-0">
            <h3 className="font-medium mb-3">{t.tags}</h3>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer hover:opacity-80 transition-opacity px-3 py-1"
                  onClick={() => handleTagToggle(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </Card>
        )}

        {/* Comment */}
        {rating > 0 && (
          <Card className="p-4 bg-card/80 backdrop-blur-sm border-0">
            <h3 className="font-medium mb-3">{t.comment}</h3>
            <Textarea
              placeholder={t.commentPlaceholder}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </Card>
        )}
      </div>

      {/* Submit Button */}
      {rating > 0 && (
        <div className="sticky bottom-0 bg-card/70 backdrop-blur-sm border-t border-border/50 p-4">
          <Button
            className="w-full h-12"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                <span>Отправка...</span>
              </div>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                {t.submit}
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}