package USCLink.USCLink;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CORSConfiguration implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:3000", "http://127.0.0.1:3000") // puerto de React
                .allowedMethods("GET","POST","PUT","DELETE","OPTIONS");
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Cambia la ruta local al directorio real de tus uploads (nota el prefijo file:)
        registry.addResourceHandler("/media/**")
                .addResourceLocations("file:///C:/Users/fcbda/Estudios/USC/Cuarto/Servicios/USCLink-1/Backend/") 
                .setCachePeriod(3600);
    }
}

