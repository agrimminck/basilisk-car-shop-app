-- Seed data para Basilisk Car Shop App
-- Inserta sucursal, categorías, productos, servicios y combos de ejemplo

INSERT INTO branches (name, address, phone) VALUES
('Taller Central', 'Av. Principal 123, Santiago', '+56 2 1234 5678');

INSERT INTO categories (name, slug, type, sort_order) VALUES
('Aceites y Lubricantes', 'aceites-lubricantes', 'product', 1),
('Filtros', 'filtros', 'product', 2),
('Frenos', 'frenos', 'product', 3),
('Suspensión', 'suspension', 'product', 4),
('Motor', 'motor', 'product', 5),
('Transmisión', 'transmision', 'product', 6),
('Electricidad', 'electricidad', 'product', 7),
('Neumáticos y Ruedas', 'neumaticos-ruedas', 'product', 8),
('Refrigeración', 'refrigeracion', 'product', 9),
('Aire Acondicionado', 'aire-acondicionado', 'product', 10),
('Carrocería y Limpieza', 'carroceria-limpieza', 'product', 11),
('Accesorios', 'accesorios', 'product', 12),
('Herramientas', 'herramientas', 'product', 13),
('Conveniencia', 'conveniencia', 'product', 14),
('Mecánica General', 'mecanica-general', 'service', 100),
('Frenos', 'servicio-frenos', 'service', 101),
('Suspensión y Dirección', 'suspension-direccion', 'service', 102),
('Electricidad', 'servicio-electricidad', 'service', 103),
('Aire Acondicionado', 'servicio-aire', 'service', 104),
('Alineación y Balanceo', 'alineacion-balanceo', 'service', 105),
('Cambio de Aceite', 'cambio-aceite', 'service', 106),
('Diagnóstico Computarizado', 'diagnostico', 'service', 107);

-- Productos y variantes
WITH cat_aceites AS (SELECT id FROM categories WHERE slug = 'aceites-lubricantes'),
     cat_filtros AS (SELECT id FROM categories WHERE slug = 'filtros'),
     cat_frenos AS (SELECT id FROM categories WHERE slug = 'frenos'),
     cat_neum AS (SELECT id FROM categories WHERE slug = 'neumaticos-ruedas'),
     cat_elec AS (SELECT id FROM categories WHERE slug = 'electricidad')
INSERT INTO products (category_id, name, description, brand, base_cost, base_sale_price, unit)
SELECT id, 'Aceite Motor Sintético', 'Aceite 100% sintético para motores a gasolina', 'Shell', 8500, 12990, 'litro' FROM cat_aceites
UNION ALL
SELECT id, 'Aceite Semisintético 15W40', 'Aceite mineral con aditivos sintéticos', 'Mobil', 6200, 9990, 'litro' FROM cat_aceites
UNION ALL
SELECT id, 'Filtro de Aceite', 'Filtro de aceite compatible multimarca', 'Mann-Filter', 3500, 5990, 'unidad' FROM cat_filtros
UNION ALL
SELECT id, 'Filtro de Aire', 'Filtro de aire de alto flujo', 'Bosch', 4200, 7990, 'unidad' FROM cat_filtros
UNION ALL
SELECT id, 'Pastillas de Freno Delanteras', 'Pastillas cerámicas de alto rendimiento', 'Brembo', 18000, 29990, 'juego' FROM cat_frenos
UNION ALL
SELECT id, 'Disco de Freno', 'Disco ventilado de repuesto', 'Brembo', 22000, 35990, 'unidad' FROM cat_frenos
UNION ALL
SELECT id, 'Neumático 185/65R15', 'Neumático touring all-season', 'Michelin', 45000, 69990, 'unidad' FROM cat_neum
UNION ALL
SELECT id, 'Neumático 195/55R16', 'Neumático performance', 'Continental', 52000, 79990, 'unidad' FROM cat_neum
UNION ALL
SELECT id, 'Batería 45Ah', 'Batería de calcio-plata 45Ah', 'Varta', 35000, 54990, 'unidad' FROM cat_elec
UNION ALL
SELECT id, 'Batería 60Ah', 'Batería de calcio-plata 60Ah', 'Varta', 42000, 65990, 'unidad' FROM cat_elec;

-- Variantes de aceite
WITH prod_aceite1 AS (SELECT id FROM products WHERE name = 'Aceite Motor Sintético')
INSERT INTO product_variants (product_id, sku, barcode, variant_name, cost, sale_price)
SELECT id, 'ACE-SHE-5W30-4L', '7801234567890', '5W30 - 4L', 8200, 12500 FROM prod_aceite1
UNION ALL
SELECT id, 'ACE-SHE-5W30-1L', '7801234567891', '5W30 - 1L', 2200, 3990 FROM prod_aceite1
UNION ALL
SELECT id, 'ACE-SHE-10W40-4L', '7801234567892', '10W40 - 4L', 7800, 11990 FROM prod_aceite1;

WITH prod_aceite2 AS (SELECT id FROM products WHERE name = 'Aceite Semisintético 15W40')
INSERT INTO product_variants (product_id, sku, barcode, variant_name, cost, sale_price)
SELECT id, 'ACE-MOB-15W40-4L', '7801234567893', '15W40 - 4L', 5800, 9500 FROM prod_aceite2
UNION ALL
SELECT id, 'ACE-MOB-15W40-1L', '7801234567894', '15W40 - 1L', 1800, 2990 FROM prod_aceite2;

-- Variantes filtros
WITH prod_filt_aceite AS (SELECT id FROM products WHERE name = 'Filtro de Aceite')
INSERT INTO product_variants (product_id, sku, barcode, variant_name, cost, sale_price)
SELECT id, 'FIL-ACE-TOY', '7801234567895', 'Toyota/Hyundai', 3200, 5500 FROM prod_filt_aceite
UNION ALL
SELECT id, 'FIL-ACE-VW', '7801234567896', 'VW/Audi/Skoda', 3400, 5900 FROM prod_filt_aceite;

WITH prod_filt_aire AS (SELECT id FROM products WHERE name = 'Filtro de Aire')
INSERT INTO product_variants (product_id, sku, barcode, variant_name, cost, sale_price)
SELECT id, 'FIL-AIR-UNI', '7801234567897', 'Universal Compacto', 3800, 7500 FROM prod_filt_aire;

-- Variantes frenos
WITH prod_pastillas AS (SELECT id FROM products WHERE name = 'Pastillas de Freno Delanteras')
INSERT INTO product_variants (product_id, sku, barcode, variant_name, cost, sale_price)
SELECT id, 'FRE-PAS-CER', '7801234567898', 'Cerámicas STD', 16500, 27990 FROM prod_pastillas;

WITH prod_disco AS (SELECT id FROM products WHERE name = 'Disco de Freno')
INSERT INTO product_variants (product_id, sku, barcode, variant_name, cost, sale_price)
SELECT id, 'FRE-DIS-VEN', '7801234567899', 'Ventilado 258mm', 20000, 32990 FROM prod_disco
UNION ALL
SELECT id, 'FRE-DIS-MAS', '7801234567900', 'Ventilado 288mm', 24000, 38990 FROM prod_disco;

-- Variantes neumáticos
WITH prod_neum1 AS (SELECT id FROM products WHERE name = 'Neumático 185/65R15')
INSERT INTO product_variants (product_id, sku, barcode, variant_name, cost, sale_price)
SELECT id, 'NEU-185-65-15', '7801234567901', 'Energy Saver', 43000, 67990 FROM prod_neum1;

WITH prod_neum2 AS (SELECT id FROM products WHERE name = 'Neumático 195/55R16')
INSERT INTO product_variants (product_id, sku, barcode, variant_name, cost, sale_price)
SELECT id, 'NEU-195-55-16', '7801234567902', 'PremiumContact 6', 49000, 76990 FROM prod_neum2;

-- Variantes baterías
WITH prod_bat45 AS (SELECT id FROM products WHERE name = 'Batería 45Ah')
INSERT INTO product_variants (product_id, sku, barcode, variant_name, cost, sale_price)
SELECT id, 'BAT-45-CAL', '7801234567903', 'Calcio 45Ah', 33000, 52990 FROM prod_bat45;

WITH prod_bat60 AS (SELECT id FROM products WHERE name = 'Batería 60Ah')
INSERT INTO product_variants (product_id, sku, barcode, variant_name, cost, sale_price)
SELECT id, 'BAT-60-CAL', '7801234567904', 'Calcio 60Ah', 40000, 63990 FROM prod_bat60;

-- Inventario en sucursal principal
WITH branch_main AS (SELECT id FROM branches WHERE name = 'Taller Central')
INSERT INTO inventory (branch_id, variant_id, quantity, min_stock_alert)
SELECT b.id, v.id, 24, 5 FROM branch_main b, product_variants v WHERE v.sku = 'ACE-SHE-5W30-4L'
UNION ALL SELECT b.id, v.id, 12, 5 FROM branch_main b, product_variants v WHERE v.sku = 'ACE-SHE-5W30-1L'
UNION ALL SELECT b.id, v.id, 18, 5 FROM branch_main b, product_variants v WHERE v.sku = 'ACE-SHE-10W40-4L'
UNION ALL SELECT b.id, v.id, 20, 8 FROM branch_main b, product_variants v WHERE v.sku = 'ACE-MOB-15W40-4L'
UNION ALL SELECT b.id, v.id, 15, 6 FROM branch_main b, product_variants v WHERE v.sku = 'FIL-ACE-TOY'
UNION ALL SELECT b.id, v.id, 10, 4 FROM branch_main b, product_variants v WHERE v.sku = 'FIL-AIR-UNI'
UNION ALL SELECT b.id, v.id, 8, 3 FROM branch_main b, product_variants v WHERE v.sku = 'FRE-PAS-CER'
UNION ALL SELECT b.id, v.id, 6, 2 FROM branch_main b, product_variants v WHERE v.sku = 'FRE-DIS-VEN'
UNION ALL SELECT b.id, v.id, 16, 4 FROM branch_main b, product_variants v WHERE v.sku = 'NEU-185-65-15'
UNION ALL SELECT b.id, v.id, 12, 4 FROM branch_main b, product_variants v WHERE v.sku = 'NEU-195-55-16'
UNION ALL SELECT b.id, v.id, 10, 3 FROM branch_main b, product_variants v WHERE v.sku = 'BAT-45-CAL'
UNION ALL SELECT b.id, v.id, 8, 3 FROM branch_main b, product_variants v WHERE v.sku = 'BAT-60-CAL';

-- Servicios
WITH cat_mec AS (SELECT id FROM categories WHERE slug = 'mecanica-general'),
     cat_fre AS (SELECT id FROM categories WHERE slug = 'servicio-frenos'),
     cat_sus AS (SELECT id FROM categories WHERE slug = 'suspension-direccion'),
     cat_ele AS (SELECT id FROM categories WHERE slug = 'servicio-electricidad'),
     cat_aire AS (SELECT id FROM categories WHERE slug = 'servicio-aire'),
     cat_ali AS (SELECT id FROM categories WHERE slug = 'alineacion-balanceo'),
     cat_cam AS (SELECT id FROM categories WHERE slug = 'cambio-aceite'),
     cat_diag AS (SELECT id FROM categories WHERE slug = 'diagnostico')
INSERT INTO services (category_id, code, name, description, sale_price, estimated_minutes)
SELECT id, 'SRV-001', 'Revisión General', 'Inspección completa de 30 puntos', 25000, 60 FROM cat_mec
UNION ALL SELECT id, 'SRV-002', 'Cambio de Pastillas de Freno', 'Cambio de pastillas delanteras o traseras', 35000, 45 FROM cat_fre
UNION ALL SELECT id, 'SRV-003', 'Rectificación de Discos', 'Rectificado de discos de freno', 28000, 60 FROM cat_fre
UNION ALL SELECT id, 'SRV-004', 'Cambio de Amortiguadores', 'Cambio de amortiguadores delanteros', 45000, 90 FROM cat_sus
UNION ALL SELECT id, 'SRV-005', 'Diagnóstico Eléctrico', 'Escaneo y diagnóstico de sistema eléctrico', 20000, 30 FROM cat_ele
UNION ALL SELECT id, 'SRV-006', 'Recarga Aire Acondicionado', 'Recarga de gas refrigerante', 35000, 45 FROM cat_aire
UNION ALL SELECT id, 'SRV-007', 'Alineación y Balanceo', 'Alineación computarizada + balanceo', 30000, 60 FROM cat_ali
UNION ALL SELECT id, 'SRV-008', 'Cambio de Aceite y Filtro', 'Cambio de aceite + filtro de aceite + revisión', 15000, 30 FROM cat_cam
UNION ALL SELECT id, 'SRV-009', 'Diagnóstico Computarizado', 'Escaneo de fallas con scanner profesional', 18000, 30 FROM cat_diag;

-- Combos
INSERT INTO bundles (name, sale_price, description) VALUES
('Pack Cambio de Aceite', 18990, 'Aceite 4L + filtro de aceite + mano de obra'),
('Pack Frenos Completo', 59990, 'Pastillas + discos + instalación'),
('Pack Revisión Anual', 49990, 'Revisión general + alineación + cambio de aceite');

WITH pack_aceite AS (SELECT id FROM bundles WHERE name = 'Pack Cambio de Aceite'),
     var_aceite AS (SELECT id FROM product_variants WHERE sku = 'ACE-SHE-5W30-4L'),
     var_filtro AS (SELECT id FROM product_variants WHERE sku = 'FIL-ACE-TOY'),
     srv_cambio AS (SELECT id FROM services WHERE code = 'SRV-008')
INSERT INTO bundle_items (bundle_id, variant_id, service_id, quantity)
SELECT p.id, v.id, NULL, 1 FROM pack_aceite p, var_aceite v
UNION ALL SELECT p.id, v.id, NULL, 1 FROM pack_aceite p, var_filtro v
UNION ALL SELECT p.id, NULL, s.id, 1 FROM pack_aceite p, srv_cambio s;

WITH pack_frenos AS (SELECT id FROM bundles WHERE name = 'Pack Frenos Completo'),
     var_pastillas AS (SELECT id FROM product_variants WHERE sku = 'FRE-PAS-CER'),
     var_discos AS (SELECT id FROM product_variants WHERE sku = 'FRE-DIS-VEN'),
     srv_frenos AS (SELECT id FROM services WHERE code = 'SRV-002')
INSERT INTO bundle_items (bundle_id, variant_id, service_id, quantity)
SELECT p.id, v.id, NULL, 1 FROM pack_frenos p, var_pastillas v
UNION ALL SELECT p.id, v.id, NULL, 2 FROM pack_frenos p, var_discos v
UNION ALL SELECT p.id, NULL, s.id, 1 FROM pack_frenos p, srv_frenos s;
