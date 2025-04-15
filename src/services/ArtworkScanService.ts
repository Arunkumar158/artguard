
// This service handles the communication with the backend API
export class ArtworkScanService {
  private static API_URL = "https://your-backend-url.com/predict";

  /**
   * Scan artwork and return classification results
   */
  static async scanArtwork(
    file: File
  ): Promise<{ label: string; confidence: number }> {
    try {
      // For development, use this mock response
      if (process.env.NODE_ENV === "development") {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Generate random classification for demo purposes
        const labels = ["Handmade", "AI-Generated", "Digital"];
        const randomIndex = Math.floor(Math.random() * labels.length);
        const confidence = 0.7 + Math.random() * 0.29; // Between 0.7 and 0.99
        
        return {
          label: labels[randomIndex],
          confidence: confidence
        };
      }

      // In production, make actual API call
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(this.API_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return {
        label: data.label,
        confidence: data.confidence,
      };
    } catch (error) {
      console.error("Error scanning artwork:", error);
      throw error;
    }
  }
}
