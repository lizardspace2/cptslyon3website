import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import lyon3GeoJSON from "@/assets/lyon3.json";

const TerritorySection = () => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Clean up to support React.StrictMode double-invocations
    const container = mapRef.current;
    if ((container as any)._leaflet_id) {
      (container as any)._leaflet_id = null;
      container.innerHTML = "";
    }

    const map = L.map(container, {
      center: [45.753, 4.87],
      zoom: 13,
      scrollWheelZoom: true,
      zoomControl: true,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    L.geoJSON(lyon3GeoJSON as any, {
      style: {
        color: "#2563eb",
        weight: 3,
        opacity: 0.8,
        fillColor: "#3b82f6",
        fillOpacity: 0.2,
      },
    }).addTo(map);

    return () => {
      map.remove();
    };
  }, []);

  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1 relative z-0"
          >
            <div 
              ref={mapRef}
              className="h-[400px] md:h-[500px] rounded-2xl shadow-card w-full overflow-hidden border border-border"
              style={{ zIndex: 0 }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-6">
              Le territoire de la CPTS Lyon 3
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Le 3ème arrondissement de Lyon est le plus peuplé de la ville avec plus de 103 000 habitants. Il regroupe des quartiers dynamiques et emblématiques : la Part-Dieu, la Guillotière, Montchat, Grange Blanche, Sans-Souci et Moncey.
            </p>
            <Button variant="default" size="lg" asChild>
              <Link to="/presentation">
                En savoir plus
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TerritorySection;
