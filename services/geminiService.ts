
import { Subscription, ExploreInsight, Recommendation } from "../types";

export interface RecommendationResponse {
  recommendations: Recommendation[];
  sources: { title: string; uri: string }[];
}

export interface ExploreResponse {
  insights: ExploreInsight[];
  sources: { title: string; uri: string }[];
}

/**
 * Mock implementation of smart recommendations.
 * Generates tailored savings advice based on user persona and active subscriptions.
 */
export const getSmartRecommendations = async (subscriptions: Subscription[], persona: string): Promise<RecommendationResponse> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const recommendations: Recommendation[] = [];
  const activeCount = subscriptions.filter(s => s.status === 'Active').length;

  // Logic to generate somewhat "relevant" mock data
  if (persona === 'Student') {
    recommendations.push({
      id: 'rec-1',
      title: 'Switch to Student Plan',
      description: 'We detected you are paying full price for YouTube. Verify your ID to save ₹60/month.',
      potentialSavings: 60,
      type: 'Downgrade',
      actionLabel: 'Verify Student ID'
    });
  }

  if (activeCount > 3) {
    recommendations.push({
      id: 'rec-2',
      title: 'Consolidate OTT Apps',
      description: 'You have 3+ active OTT subs. Switch to the Amazon Prime + SonyLIV bundle for a 20% discount.',
      potentialSavings: 150,
      type: 'Family',
      actionLabel: 'View Bundle'
    });
  }

  const unused = subscriptions.find(s => s.usageLevel === 'Low' || s.usageLevel === 'Zero');
  if (unused) {
    recommendations.push({
      id: 'rec-3',
      title: `Cancel Unused ${unused.name}`,
      description: `You haven't used ${unused.name} in 25 days. Cancelling now saves you ${unused.currency}${unused.amount * 12} annually.`,
      potentialSavings: unused.amount,
      type: 'Cancel',
      actionLabel: `Revoke ${unused.name}`
    });
  }

  return {
    recommendations,
    sources: [
      { title: "Economic Times: Subscription Fatigue in India", uri: "https://economictimes.indiatimes.com" },
      { title: "Gadgets360: Best Bundle Offers 2025", uri: "https://gadgets360.com" }
    ]
  };
};

/**
 * Mock implementation of market insights.
 * Combines general market trends with user data for a "smart" explore experience.
 */
export const getExploreInsights = async (subscriptions: Subscription[]): Promise<ExploreResponse> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1200));

  const insights: ExploreInsight[] = [
    {
      id: 'exp-1',
      title: 'Swiggy Platform Fee Hike',
      description: 'Swiggy has increased its platform fee to ₹10 per order in major metros. Monthly costs for frequent users may rise by ₹200.',
      sourceLabel: 'Inc42 Market Report',
      type: 'Price Hike',
      actionType: 'None',
      targetService: 'Swiggy',
      relevance: 'High priority: You are an active Swiggy One member.',
      ctaLabel: 'See Impact',
      icon: '🍕'
    },
    {
      id: 'exp-2',
      title: 'IPL 2025: Disney+ Hotstar Offer',
      description: 'The IPL season is approaching. Annual plans are currently 30% cheaper if you subscribe before the first match.',
      sourceLabel: 'Financial Express',
      type: 'New Deal',
      actionType: 'Subscribe',
      targetService: 'Disney+ Hotstar',
      relevance: 'Seasonal: You usually watch sports during March-May.',
      ctaLabel: 'Grab 30% Off',
      icon: '🏏'
    },
    {
      id: 'exp-3',
      title: 'Netflix Password Sharing Policy',
      description: 'Netflix is tightening extra-member fees in India. Check your family profiles to avoid surprise charges.',
      sourceLabel: 'TechCrunch India',
      type: 'Current Affair',
      actionType: 'Pause',
      targetService: 'Netflix',
      relevance: 'Financial Hygiene: You have a Premium shared plan.',
      ctaLabel: 'Manage Profiles',
      icon: '🎬'
    },
    {
      id: 'exp-4',
      title: 'Alternative: JioCinema Premium',
      description: 'JioCinema is offering HBO and Warner Bros content for ₹29/month, making it a viable alternative to more expensive OTTs.',
      sourceLabel: 'Economic Times',
      type: 'Alternative',
      actionType: 'Subscribe',
      targetService: 'JioCinema',
      relevance: 'Optimization: Cheaper alternative to your current entertainment stack.',
      ctaLabel: 'Try for ₹29',
      icon: '✨'
    }
  ];

  return {
    insights,
    sources: [
      { title: "Inc42: Swiggy's Revenue Strategy 2025", uri: "https://inc42.com" },
      { title: "Hindustan Times: IPL Streaming Rights Update", uri: "https://hindustantimes.com" }
    ]
  };
};
