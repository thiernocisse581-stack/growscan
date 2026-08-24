import ngrok from "@ngrok/ngrok";

async function main() {
  console.log("⚡ Initialisation du tunnel Ngrok pour GrowScan...");
  
  const listener = await ngrok.forward({
    addr: 3000,
    authtoken: "3IHNI5oH9IVLFqezGUmtyL6o18T_7F8nzfBt7Qe6kgwDSBmui",
    domain: "unskilled-sedation-dancing.ngrok-free.dev",
  });

  console.log(`\n======================================================`);
  console.log(`✅ TUNNEL NGROK EN LIGNE SUR PORT 3000 !`);
  console.log(`🌐 URL publique : ${listener.url()}`);
  console.log(`📡 Moneroo Webhook URL : ${listener.url()}/api/payments/webhook`);
  console.log(`======================================================\n`);

  // Maintenir le serveur de tunnel actif indéfiniment
  setInterval(() => {
    // Keep alive heartbeat
  }, 1000 * 60 * 60);
}

main().catch((err) => {
  console.error("❌ Erreur lors du lancement de Ngrok :", err);
});
