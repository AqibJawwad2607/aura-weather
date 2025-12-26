import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { lat, lon, radius = 500 } = await req.json();
    
    console.log('Earthquake request received:', { lat, lon, radius });

    // USGS Earthquake API - past 24 hours, minimum magnitude 2.5
    const endTime = new Date().toISOString();
    const startTime = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    
    let url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${startTime}&endtime=${endTime}&minmagnitude=2.5&orderby=time&limit=20`;
    
    // Add location filter if coordinates provided
    if (lat && lon) {
      url += `&latitude=${lat}&longitude=${lon}&maxradiuskm=${radius}`;
    }

    console.log('Fetching earthquake data from USGS...');
    
    const response = await fetch(url);
    const data = await response.json();

    const earthquakes = data.features?.map((feature: any) => ({
      id: feature.id,
      magnitude: feature.properties.mag,
      place: feature.properties.place,
      time: feature.properties.time,
      depth: feature.geometry.coordinates[2],
      lat: feature.geometry.coordinates[1],
      lon: feature.geometry.coordinates[0],
      url: feature.properties.url,
      tsunami: feature.properties.tsunami === 1,
      alert: feature.properties.alert,
      significance: feature.properties.sig,
    })) || [];

    console.log(`Found ${earthquakes.length} earthquakes`);

    return new Response(JSON.stringify({ earthquakes }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in get-earthquakes function:', error);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
