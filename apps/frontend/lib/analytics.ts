/**
 * Google Analytics 4 Event Tracking Utilities
 * 
 * This module provides type-safe event tracking functions for GA4.
 * Events are only sent in production or when explicitly enabled.
 */

// Extend the Window interface to include gtag
declare global {
  interface Window {
    gtag?: (
      command: 'event' | 'config' | 'set',
      targetId: string,
      config?: Record<string, any>
    ) => void;
  }
}

/**
 * Check if analytics is available and should be used
 */
const isAnalyticsAvailable = (): boolean => {
  return typeof window !== 'undefined' && typeof window.gtag === 'function';
};

/**
 * Generic event tracking function
 */
export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, any>
) => {
  if (!isAnalyticsAvailable()) {
    console.log('[Analytics Debug]', eventName, eventParams);
    return;
  }

  window.gtag!('event', eventName, eventParams);
};

/**
 * Track page views (usually automatic, but can be called manually)
 */
export const trackPageView = (url: string) => {
  trackEvent('page_view', {
    page_path: url,
    page_title: document.title,
  });
};

/**
 * Track button clicks
 */
export const trackButtonClick = (buttonName: string, location?: string) => {
  trackEvent('button_click', {
    button_name: buttonName,
    location: location || 'unknown',
  });
};

/**
 * Track form submissions
 */
export const trackFormSubmit = (formName: string, success: boolean = true) => {
  trackEvent('form_submit', {
    form_name: formName,
    success: success,
  });
};

/**
 * Track navigation events
 */
export const trackNavigation = (from: string, to: string) => {
  trackEvent('navigation', {
    from_page: from,
    to_page: to,
  });
};

/**
 * Track marketplace-specific events
 */
export const trackMarketplaceEvent = {
  /**
   * Track when a user views an ad slot
   */
  viewAdSlot: (adSlotId: string, adSlotName: string) => {
    trackEvent('view_ad_slot', {
      ad_slot_id: adSlotId,
      ad_slot_name: adSlotName,
    });
  },

  /**
   * Track when a user requests a placement
   */
  requestPlacement: (adSlotId: string, campaignId?: string) => {
    trackEvent('request_placement', {
      ad_slot_id: adSlotId,
      campaign_id: campaignId,
    });
  },

  /**
   * Track when a user filters the marketplace
   */
  filterMarketplace: (filterType: string, filterValue: string) => {
    trackEvent('filter_marketplace', {
      filter_type: filterType,
      filter_value: filterValue,
    });
  },

  /**
   * Track when a user searches the marketplace
   */
  searchMarketplace: (searchTerm: string) => {
    trackEvent('search_marketplace', {
      search_term: searchTerm,
    });
  },
};

/**
 * Track campaign-specific events
 */
export const trackCampaignEvent = {
  /**
   * Track campaign creation
   */
  createCampaign: (campaignName: string, budget: number) => {
    trackEvent('create_campaign', {
      campaign_name: campaignName,
      budget: budget,
    });
  },

  /**
   * Track campaign update
   */
  updateCampaign: (campaignId: string, campaignName: string) => {
    trackEvent('update_campaign', {
      campaign_id: campaignId,
      campaign_name: campaignName,
    });
  },

  /**
   * Track campaign status change
   */
  changeCampaignStatus: (campaignId: string, newStatus: string) => {
    trackEvent('change_campaign_status', {
      campaign_id: campaignId,
      new_status: newStatus,
    });
  },
};

/**
 * Track authentication events
 */
export const trackAuthEvent = {
  /**
   * Track login attempts
   */
  login: (role: 'sponsor' | 'publisher') => {
    trackEvent('login', {
      role: role,
    });
  },

  /**
   * Track logout
   */
  logout: () => {
    trackEvent('logout', {});
  },

  /**
   * Track role selection
   */
  selectRole: (role: 'sponsor' | 'publisher') => {
    trackEvent('select_role', {
      role: role,
    });
  },
};

/**
 * Track user engagement
 */
export const trackEngagement = {
  /**
   * Track when a user opens a modal
   */
  openModal: (modalName: string) => {
    trackEvent('open_modal', {
      modal_name: modalName,
    });
  },

  /**
   * Track when a user closes a modal
   */
  closeModal: (modalName: string) => {
    trackEvent('close_modal', {
      modal_name: modalName,
    });
  },

  /**
   * Track tab changes
   */
  changeTab: (tabName: string, location: string) => {
    trackEvent('change_tab', {
      tab_name: tabName,
      location: location,
    });
  },
};
