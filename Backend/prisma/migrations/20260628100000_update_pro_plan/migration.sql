-- Plan Pro: precio 9,99€/mes con límite de 50.000 caracteres TTS (antes: ilimitado/0)
UPDATE "plans" SET "ttsLimit" = 50000 WHERE "id" = 'pro';
