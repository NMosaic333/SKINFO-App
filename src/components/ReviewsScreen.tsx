import React, { useState } from 'react';
import { ArrowLeft, Star, Filter, Search, ThumbsUp, Shield } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ImageWithFallback } from './figma/ImageWithFallback';
import type { Review, Screen } from '../App';

interface ReviewsScreenProps {
  onNavigate: (screen: Screen) => void;
}

const mockReviews: Review[] = [
  {
    id: '1',
    user: 'Sarah M.',
    rating: 5,
    comment: 'This serum completely transformed my skin! No irritation despite having sensitive skin. The vitamin C really brightened my complexion.',
    skinType: 'Sensitive',
    verified: true,
    date: '2024-10-01'
  },
  {
    id: '2',
    user: 'Emma K.',
    rating: 4,
    comment: 'Great product overall. I noticed some improvement in my dark spots after 3 weeks. The texture is nice and absorbs well.',
    skinType: 'Combination',
    verified: true,
    date: '2024-09-28'
  },
  {
    id: '3',
    user: 'Lisa R.',
    rating: 3,
    comment: 'The product works but the fragrance is too strong for my liking. It sometimes causes mild irritation around my eyes.',
    skinType: 'Dry',
    verified: false,
    date: '2024-09-25'
  },
  {
    id: '4',
    user: 'Maria L.',
    rating: 5,
    comment: 'Love how this makes my skin glow! No breakouts and my skin feels so much smoother. Will definitely repurchase.',
    skinType: 'Oily',
    verified: true,
    date: '2024-09-20'
  },
  {
    id: '5',
    user: 'Jenny W.',
    rating: 2,
    comment: 'Unfortunately, this broke me out. I think the fragrance was the culprit. Wish they had a fragrance-free version.',
    skinType: 'Acne-prone',
    verified: true,
    date: '2024-09-15'
  }
];

const skinTypeColors: Record<string, string> = {
  'Sensitive': 'bg-pink-50 text-pink-700 border-pink-200',
  'Combination': 'bg-purple-50 text-purple-700 border-purple-200',
  'Dry': 'bg-blue-50 text-blue-700 border-blue-200',
  'Oily': 'bg-green-50 text-green-700 border-green-200',
  'Acne-prone': 'bg-orange-50 text-orange-700 border-orange-200',
  'Normal': 'bg-gray-50 text-gray-700 border-gray-200'
};

export function ReviewsScreen({ onNavigate }: ReviewsScreenProps) {
  const [reviews, setReviews] = useState(mockReviews);
  const [searchTerm, setSearchTerm] = useState('');
  const [skinTypeFilter, setSkinTypeFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSkinType = skinTypeFilter === 'all' || review.skinType === skinTypeFilter;
    const matchesRating = ratingFilter === 'all' || review.rating.toString() === ratingFilter;
    
    return matchesSearch && matchesSkinType && matchesRating;
  });

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: (reviews.filter(r => r.rating === rating).length / reviews.length) * 100
  }));

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onNavigate('home')}
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg">Community Reviews</h1>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Community Banner */}
        <Card className="p-0 bg-gradient-to-r from-pink-100 to-rose-100 border-pink-200 overflow-hidden">
          <div className="grid md:grid-cols-3 gap-4">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1730240281256-3c22e803a51c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnbG93aW5nJTIwc2tpbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2MTY1NDYxMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Community member"
              className="w-full h-full object-cover"
            />
            <div className="md:col-span-2 p-6 flex flex-col justify-center">
              <h3 className="text-2xl mb-2 bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                Trusted by Our Community
              </h3>
              <p className="text-gray-700">
                Real reviews from real people sharing their skincare experiences
              </p>
            </div>
          </div>
        </Card>
        
        {/* Rating Summary */}
        <Card className="p-6 bg-white/70">
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-3xl text-gray-800 mb-1">{averageRating.toFixed(1)}</div>
              <div className="flex justify-center mb-2">
                {renderStars(Math.round(averageRating))}
              </div>
              <p className="text-sm text-gray-600">{reviews.length} reviews</p>
            </div>
            <div className="space-y-2">
              {ratingDistribution.map(({ rating, count, percentage }) => (
                <div key={rating} className="flex items-center space-x-2 text-sm">
                  <span className="w-3">{rating}</span>
                  <Star className="w-3 h-3 text-yellow-500" />
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full" 
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-6">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Search and Filters */}
        <Card className="p-4 bg-white/70">
          <div className="space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Select value={skinTypeFilter} onValueChange={setSkinTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Skin Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Skin Types</SelectItem>
                  <SelectItem value="Sensitive">Sensitive</SelectItem>
                  <SelectItem value="Oily">Oily</SelectItem>
                  <SelectItem value="Dry">Dry</SelectItem>
                  <SelectItem value="Combination">Combination</SelectItem>
                  <SelectItem value="Acne-prone">Acne-prone</SelectItem>
                  <SelectItem value="Normal">Normal</SelectItem>
                </SelectContent>
              </Select>

              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews.length === 0 ? (
            <Card className="p-8 text-center bg-white/70">
              <p className="text-gray-500">No reviews match your filters</p>
            </Card>
          ) : (
            filteredReviews.map((review) => (
              <Card key={review.id} className="p-4 bg-white/70">
                <div className="space-y-3">
                  {/* Review Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-green-100 text-green-700 text-xs">
                          {review.user.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">{review.user}</span>
                          {review.verified && (
                            <Shield className="w-3 h-3 text-green-500" title="Verified Purchase" />
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex">
                            {renderStars(review.rating)}
                          </div>
                          <span className="text-xs text-gray-500">{review.date}</span>
                        </div>
                      </div>
                    </div>
                    <Badge className={`text-xs border ${skinTypeColors[review.skinType] || skinTypeColors.Normal}`}>
                      {review.skinType}
                    </Badge>
                  </div>

                  {/* Review Content */}
                  <p className="text-sm text-gray-700 leading-relaxed">{review.comment}</p>

                  {/* Review Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <Button variant="ghost" size="sm" className="text-xs h-8">
                      <ThumbsUp className="w-3 h-3 mr-1" />
                      Helpful
                    </Button>
                    <span className="text-xs text-gray-500">
                      {review.verified ? 'Verified Purchase' : 'Unverified'}
                    </span>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Add Review Button */}
        <Button className="w-full bg-green-500 hover:bg-green-600 text-white rounded-xl h-12">
          Write a Review
        </Button>
      </div>
    </div>
  );
}
