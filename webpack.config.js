import path from "path";
import { fileURLToPath } from "url";

// Fix for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Assign the configuration to a variable
const webpackConfig = {
  entry: "./src/app/wallet/wagmiWallet.js", // Path to your wagmiWallet.js file
  output: {
    path: path.resolve(__dirname, "public/wallet"), // Output directory
    filename: "wagmiWallet.bundle.js", // Output file name
  },
  mode: "production", // Minify for production
};

// Export the configuration
export default webpackConfig;
