# Moji Računi v5.1

Bug fix:
- Struja i Grejanje grafikoni su u v5.0 imali renderer, ali renderStatistics() ga nije pozivao.
- v5.1 eksplicitno poziva oba grafikona svaki put kada se otvori/osveži Statistika.
- Grafikoni koriste samo plaćene račune i sabiraju istu stavku kroz lokacije.
- Sve ostalo iz v5.0 ostaje nepromenjeno.
