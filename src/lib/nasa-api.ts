"use server";

// NASA API Service for Astronomy Picture of the Day and Near Earth Objects

const NASA_API_KEY = process.env.NASA_API_KEY || "DEMO_KEY";
const BASE_URL = "https://api.nasa.gov";

// ============================================================================
// TYPES
// ============================================================================

export interface APODData {
  date: string;
  title: string;
  explanation: string;
  url: string;
  hdurl?: string;
  media_type: "image" | "video";
  copyright?: string;
  thumbnail_url?: string;
}

export interface NearEarthObject {
  id: string;
  name: string;
  nasa_jpl_url: string;
  estimated_diameter: {
    kilometers: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
    meters: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
  };
  is_potentially_hazardous_asteroid: boolean;
  close_approach_data: {
    close_approach_date: string;
    relative_velocity: {
      kilometers_per_hour: string;
    };
    miss_distance: {
      kilometers: string;
      lunar: string;
    };
  }[];
}

export interface NeoWsResponse {
  element_count: number;
  near_earth_objects: {
    [date: string]: NearEarthObject[];
  };
}

// ============================================================================
// API FUNCTIONS
// ============================================================================

/**
 * Fetches NASA's Astronomy Picture of the Day
 * Cached for 24 hours in production
 */
export async function getAPOD(): Promise<APODData | null> {
  try {
    const response = await fetch(
      `${BASE_URL}/planetary/apod?api_key=${NASA_API_KEY}`,
      {
        next: { revalidate: 86400 }, // Cache for 24 hours
      }
    );

    if (!response.ok) {
      console.error("NASA APOD API error:", response.status);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch APOD:", error);
    return null;
  }
}

/**
 * Fetches near-Earth asteroids for today
 * Returns count and potentially hazardous objects
 */
export async function getNearEarthObjects(): Promise<{
  count: number;
  hazardousCount: number;
  closestApproach: NearEarthObject | null;
} | null> {
  try {
    const today = new Date().toISOString().split("T")[0];
    const response = await fetch(
      `${BASE_URL}/neo/rest/v1/feed?start_date=${today}&end_date=${today}&api_key=${NASA_API_KEY}`,
      {
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      console.error("NASA NeoWs API error:", response.status);
      return null;
    }

    const data: NeoWsResponse = await response.json();
    const todayObjects = data.near_earth_objects[today] || [];

    const hazardousAsteroids = todayObjects.filter(
      (obj) => obj.is_potentially_hazardous_asteroid
    );

    // Find the closest approaching asteroid
    let closestApproach: NearEarthObject | null = null;
    let minDistance = Infinity;

    for (const obj of todayObjects) {
      if (obj.close_approach_data.length > 0) {
        const distance = parseFloat(
          obj.close_approach_data[0].miss_distance.kilometers
        );
        if (distance < minDistance) {
          minDistance = distance;
          closestApproach = obj;
        }
      }
    }

    return {
      count: todayObjects.length,
      hazardousCount: hazardousAsteroids.length,
      closestApproach,
    };
  } catch (error) {
    console.error("Failed to fetch NEO data:", error);
    return null;
  }
}

// ============================================================================
// SPACE EVENTS & COSMIC FACTS
// ============================================================================

interface CosmicEvent {
  type: "meteor_shower" | "planetary_event" | "eclipse" | "space_milestone" | "fun_fact";
  title: string;
  message: string;
  emoji: string;
  importance: "low" | "medium" | "high";
}

/**
 * Returns any notable cosmic events for today
 * Uses a combination of known astronomical events and fun space facts
 */
export async function getCosmicEvents(): Promise<CosmicEvent[]> {
  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const events: CosmicEvent[] = [];

  // Major meteor showers
  const meteorShowers: Record<string, { peak: [number, number][]; name: string }> = {
    quadrantids: { peak: [[1, 3], [1, 4]], name: "Quadrantids" },
    lyrids: { peak: [[4, 22], [4, 23]], name: "Lyrids" },
    eta_aquariids: { peak: [[5, 5], [5, 6]], name: "Eta Aquariids" },
    perseids: { peak: [[8, 11], [8, 12], [8, 13]], name: "Perseids" },
    orionids: { peak: [[10, 21], [10, 22]], name: "Orionids" },
    leonids: { peak: [[11, 17], [11, 18]], name: "Leonids" },
    geminids: { peak: [[12, 13], [12, 14], [12, 15]], name: "Geminids" },
    ursids: { peak: [[12, 21], [12, 22], [12, 23]], name: "Ursids" },
  };

  for (const shower of Object.values(meteorShowers)) {
    if (shower.peak.some(([m, d]) => m === month && d === day)) {
      events.push({
        type: "meteor_shower",
        title: `${shower.name} Meteor Shower`,
        message: `Tonight is the peak of the ${shower.name}! Look up for shooting stars ✨`,
        emoji: "☄️",
        importance: "high",
      });
    }
  }

  // Space milestones
  const milestones: Record<string, CosmicEvent> = {
    "7-20": {
      type: "space_milestone",
      title: "Apollo 11 Anniversary",
      message: "On this day in 1969, humans first walked on the Moon! 🌙",
      emoji: "👨‍🚀",
      importance: "high",
    },
    "4-12": {
      type: "space_milestone",
      title: "Yuri's Night",
      message: "On this day in 1961, Yuri Gagarin became the first human in space!",
      emoji: "🚀",
      importance: "high",
    },
    "10-4": {
      type: "space_milestone",
      title: "Sputnik Anniversary",
      message: "On this day in 1957, Sputnik 1 launched the Space Age!",
      emoji: "🛰️",
      importance: "medium",
    },
    "2-18": {
      type: "space_milestone",
      title: "Pluto Discovery",
      message: "On this day in 1930, Clyde Tombaugh discovered Pluto!",
      emoji: "🔭",
      importance: "medium",
    },
  };

  const dateKey = `${month}-${day}`;
  if (milestones[dateKey]) {
    events.push(milestones[dateKey]);
  }

  return events;
}

/**
 * Returns a random cosmic fun fact
 */
export async function getRandomCosmicFact(): Promise<CosmicEvent> {
  const facts: Omit<CosmicEvent, "type" | "importance">[] = [
    {
      title: "Neutron Star Density",
      message: "A teaspoon of neutron star material weighs about 6 billion tons!",
      emoji: "⭐",
    },
    {
      title: "Space Smell",
      message: "Astronauts say space smells like seared steak and hot metal!",
      emoji: "🥩",
    },
    {
      title: "Venus Day",
      message: "A day on Venus is longer than its year!",
      emoji: "🪐",
    },
    {
      title: "Diamond Rain",
      message: "On Neptune and Uranus, it rains diamonds!",
      emoji: "💎",
    },
    {
      title: "Sun's Journey",
      message: "Light from the Sun takes 8 minutes 20 seconds to reach Earth.",
      emoji: "☀️",
    },
    {
      title: "Milky Way Center",
      message: "The center of our galaxy tastes like raspberries (ethyl formate)!",
      emoji: "🍇",
    },
    {
      title: "Space Silence",
      message: "In space, no one can hear you scream — sound needs a medium!",
      emoji: "🔇",
    },
    {
      title: "Footprints on Moon",
      message: "Footprints on the Moon will last 100 million years — no wind!",
      emoji: "👣",
    },
    {
      title: "Asteroid Belt",
      message: "The asteroid belt's total mass is less than 4% of the Moon's!",
      emoji: "🌑",
    },
    {
      title: "Red Sunset on Mars",
      message: "Sunsets on Mars appear blue due to its thin atmosphere!",
      emoji: "🔵",
    },
  ];

  const randomFact = facts[Math.floor(Math.random() * facts.length)];
  return {
    ...randomFact,
    type: "fun_fact",
    importance: "low",
  };
}
