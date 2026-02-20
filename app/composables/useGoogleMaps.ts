import { ref, onUnmounted } from 'vue';

export const useGoogleMaps = (apiKey: string) => {
  const isGoogleReady = ref(false);
  const predictions = ref<google.maps.places.AutocompletePrediction[]>([]);
  let autocompleteService: google.maps.places.AutocompleteService | null = null;
  let placesService: google.maps.places.PlacesService | null = null;

  const loadGoogleMapsScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (window.google && window.google.maps && window.google.maps.places) {
        resolve();
        return;
      }

      if (document.querySelector('script[src*="maps.googleapis.com"]')) {
        const checkGoogle = setInterval(() => {
          if (
            window.google &&
            window.google.maps &&
            window.google.maps.places
          ) {
            clearInterval(checkGoogle);
            resolve();
          }
        }, 100);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = (err) => reject(err);
      document.head.appendChild(script);
    });
  };

  const initGoogleMaps = async () => {
    try {
      await loadGoogleMapsScript();
      if (window.google && window.google.maps.places) {
        autocompleteService =
          new window.google.maps.places.AutocompleteService();
        placesService = new window.google.maps.places.PlacesService(
          document.createElement('div')
        );
        setTimeout(() => {
          isGoogleReady.value = true;
        }, 300);
      }
    } catch (error) {
      console.error('Error Google Maps:', error);
      isGoogleReady.value = true; // Fallback to allow manual entry if needed
    }
  };

  const getPlacePredictions = (input: string) => {
    if (!input || !autocompleteService) {
      predictions.value = [];
      return;
    }

    const request = {
      input,
      componentRestrictions: { country: 'mx' },
      types: ['geocode', 'establishment'],
    };

    autocompleteService.getPlacePredictions(request, (results, status) => {
      if (
        status === window.google.maps.places.PlacesServiceStatus.OK &&
        results
      ) {
        predictions.value = results;
      } else {
        predictions.value = [];
      }
    });
  };

  const getPlaceDetails = (
    placeId: string
  ): Promise<google.maps.places.PlaceResult | null> => {
    return new Promise((resolve) => {
      if (!placesService) {
        resolve(null);
        return;
      }
      placesService.getDetails(
        { placeId, fields: ['geometry'] },
        (place, status) => {
          if (
            status === window.google.maps.places.PlacesServiceStatus.OK &&
            place
          ) {
            resolve(place);
          } else {
            resolve(null);
          }
        }
      );
    });
  };

  return {
    isGoogleReady,
    predictions,
    initGoogleMaps,
    getPlacePredictions,
    getPlaceDetails,
  };
};
