import type { Preset } from './types.js';

const preset: Preset = {
  name: 'Dermatology',
  description: 'Medical dermatology encyclopedia with conditions, treatments, procedures, and symptoms',
  languages: [
    { id: 'en', title: 'English', sort: 1 },
    { id: 'ro', title: 'Romanian', sort: 2 },
  ],
  nodeTypes: [
    { code: 'entry', title: {"en":"Entry","ro":"Intrare"}, sort: 0, notes: 'Encyclopedia entry (e.g., Eczema, Psoriasis)' },
    { code: 'section', title: {"en":"Section","ro":"Secțiune"}, sort: 1, notes: 'Category/grouping for encyclopedia entries' },
    { code: 'article', title: {"en":"Article","ro":"Articol"}, sort: 2, notes: 'Blog or news article' },
    { code: 'page', title: {"en":"Page","ro":"Pagină"}, sort: 3, notes: 'Static page (e.g., About, Contact)' },
    { code: 'term', title: {"en":"Term","ro":"Termen"}, sort: 5, notes: 'A glossary term with definition' },
  ],
  collections: [
    {
      collection: { code: 'encyclopedia', sort: 1, notes: 'Dermatology glossary with conditions, treatments, and medical terms' },
      templates: [
        {
          template: { code: 'condition', title: {"en":"Condition","ro":"Afecțiune"}, notes: 'Template for skin conditions' },
          blocks: [
            {
              block: { code: 'overview', title: {"en":"Overview","ro":"Prezentare Generală"}, content_type: 'text', sort: 0, notes: 'Brief overview of the condition' },
            },
            {
              block: { code: 'causes', title: {"en":"Causes","ro":"Cauze"}, content_type: 'text_list', sort: 2, notes: 'Causes and risk factors' },
            },
            {
              block: { code: 'article', title: {"en":"Article","ro":"Articol"}, content_type: 'text_list', sort: 4, notes: 'Detailed article about the condition' },
            },
          ],
        },
        {
          template: { code: 'introduction', title: {"en":"Introduction","ro":"Introducere"}, notes: 'Template for introduction pages' },
          blocks: [
            {
              block: { code: 'content', title: {"en":"Content","ro":"Conținut"}, content_type: 'text_list', sort: 0, notes: 'Introduction content paragraphs' },
            },
          ],
        },
        {
          template: { code: 'section-template', title: {"en":"Section Template","ro":"Șablon Secțiune"} },
          blocks: [
            {
              block: { code: 'introduction', title: {"en":"Introduction","ro":"Introducere"}, content_type: 'text', sort: 1 },
            },
            {
              block: { code: 'description', title: {"en":"Description","ro":"Descriere"}, content_type: 'text', sort: 2 },
            },
          ],
        },
        {
          template: { code: 'symptom', title: {"en":"Symptom","ro":"Simptom"}, notes: 'Template for signs and symptoms' },
          blocks: [
            {
              block: { code: 'description', title: {"en":"Description","ro":"Descriere"}, content_type: 'text', sort: 0, notes: 'Description of the symptom' },
            },
          ],
        },
        {
          template: { code: 'treatment', title: null, notes: 'Template for treatment entries' },
          blocks: [
            {
              block: { code: 'description', title: {"en":"Description","ro":"Descriere"}, content_type: 'text', sort: null },
            },
            {
              block: { code: 'indications', title: {"en":"Indications","ro":"Indicații"}, content_type: 'text', sort: null },
            },
            {
              block: { code: 'usage', title: {"en":"How to use","ro":"Mod de utilizare"}, content_type: 'text', sort: null },
            },
            {
              block: { code: 'side-effects', title: {"en":"Side effects","ro":"Efecte secundare"}, content_type: 'text', sort: null },
            },
          ],
        },
      ],
      nodes: [
        {
          node: { code: 'introduction', templateCode: 'introduction', nodeTypeCode: 'page', title: {"en":"Introduction","ro":"Introducere"}, slug: {"en":"introduction","ro":"introducere"}, notes: 'Welcome page explaining the purpose and scope of the dermatology encyclopedia', sort: 0 },
          contents: [
            { blockCode: 'content', value: {"en":["Welcome to the Dermatology Encyclopedia, your comprehensive guide to skin health. This resource covers a wide range of dermatological topics, from common skin conditions to advanced treatments and procedures.","The skin is the largest organ of the human body, serving as a protective barrier against environmental factors, regulating body temperature, and playing a crucial role in immune function. Understanding how to care for your skin is essential for overall health.","Browse our sections to learn about various skin conditions, their symptoms, available treatments, and medical procedures. Whether you are a patient seeking information or a healthcare professional looking for a quick reference, this encyclopedia is designed to provide accurate and accessible information."],"ro":["Bine ați venit în Enciclopedia de Dermatologie, ghidul dumneavoastră complet pentru sănătatea pielii. Această resursă acoperă o gamă largă de subiecte dermatologice, de la afecțiuni comune ale pielii până la tratamente și proceduri avansate.","Pielea este cel mai mare organ al corpului uman, servind ca o barieră de protecție împotriva factorilor de mediu, reglând temperatura corpului și jucând un rol crucial în funcția imunitară. Înțelegerea modului de îngrijire a pielii este esențială pentru sănătatea generală.","Răsfoiți secțiunile noastre pentru a afla despre diverse afecțiuni ale pielii, simptomele acestora, tratamentele disponibile și procedurile medicale. Fie că sunteți un pacient care caută informații sau un profesionist în domeniul sănătății care caută o referință rapidă, această enciclopedie este concepută pentru a oferi informații precise și accesibile."]} },
          ],
        },
        {
          node: { code: 'conditions', templateCode: 'section-template', nodeTypeCode: 'section', title: {"en":"Skin Conditions","ro":"Afectiuni ale Pielii"}, slug: {"en":"skin-conditions","ro":"afectiuni-ale-pielii"}, notes: 'Skin diseases and disorders (e.g., Eczema, Psoriasis, Acne)', sort: 1 },
          contents: [
            { blockCode: 'introduction', value: {"en":"Skin conditions affect millions of people worldwide, ranging from mild irritations to chronic diseases requiring ongoing management.","ro":"Afectiunile pielii afecteaza milioane de oameni din intreaga lume."} },
            { blockCode: 'description', value: {"en":"This section covers common dermatological conditions including their causes, symptoms, diagnosis, and treatment options.","ro":"Aceasta sectiune acopera afectiunile dermatologice comune."} },
          ],
          children: [
            {
              node: { code: 'eczema', templateCode: 'condition', nodeTypeCode: 'entry', title: {"en":"Eczema","ro":"Eczemă"}, slug: {"en":"eczema","ro":"eczema"}, subtitle: {"en":"Atopic Dermatitis","ro":"Dermatită Atopică"}, sort: 0 },
              contents: [
                { blockCode: 'overview', value: {"en":"Eczema, also known as atopic dermatitis, is a chronic inflammatory skin condition characterized by dry, itchy, and inflamed skin. It often begins in childhood and can persist into adulthood, with periods of flare-ups and remission.","ro":"Eczema, cunoscută și sub numele de dermatită atopică, este o afecțiune inflamatorie cronică a pielii caracterizată prin piele uscată, cu mâncărime și inflamată. Adesea începe în copilărie și poate persista până la vârsta adultă, cu perioade de acutizări și remisiuni."} },
                { blockCode: 'causes', value: {"en":["Genetic factors","Immune system dysfunction","Environmental triggers","Skin barrier defects","Allergens and irritants","Stress"],"ro":["Factori genetici","Disfuncție a sistemului imunitar","Factori declanșatori din mediu","Defecte ale barierei pielii","Alergeni și iritanți","Stres"]} },
                { blockCode: 'article', value: {"en":["Eczema, clinically known as atopic dermatitis, represents one of the most prevalent chronic skin conditions affecting people worldwide. This inflammatory disorder typically manifests as patches of dry, itchy, and inflamed skin that can significantly impact quality of life. While the condition is most commonly diagnosed in infants and young children, it can persist into adulthood or even develop for the first time in adults.","The pathophysiology of eczema involves a complex interplay between genetic predisposition, immune system dysfunction, and environmental factors. Research has identified mutations in the filaggrin gene, which plays a crucial role in maintaining the skin barrier, as a significant risk factor. When this barrier is compromised, the skin becomes more susceptible to irritants, allergens, and microbial colonization.","Living with eczema requires a comprehensive management approach that goes beyond treating flare-ups. Daily skincare routines should focus on maintaining skin hydration and barrier function. This typically involves applying moisturizers immediately after bathing while the skin is still damp, using gentle, fragrance-free cleansers, and avoiding known triggers such as harsh soaps, certain fabrics, and extreme temperatures.","The psychological impact of eczema should not be underestimated. Chronic itching can disrupt sleep, leading to fatigue and difficulty concentrating. Visible skin lesions may cause self-consciousness and social anxiety, particularly in children and adolescents. Healthcare providers increasingly recognize the importance of addressing these psychosocial aspects as part of comprehensive eczema care.","Recent advances in treatment have expanded options for patients with moderate to severe eczema. Biologic medications, such as dupilumab, target specific components of the immune system involved in the inflammatory cascade. These therapies have shown remarkable efficacy in clinical trials, offering hope for patients who have not responded adequately to conventional treatments.","Prevention strategies focus on identifying and avoiding triggers while maintaining optimal skin health. Keeping a symptom diary can help patients and their healthcare providers identify patterns and potential triggers. Environmental modifications, such as using air purifiers and maintaining appropriate humidity levels, may also help reduce flare-ups."],"ro":["Eczema, cunoscută clinic sub numele de dermatită atopică, reprezintă una dintre cele mai răspândite afecțiuni cronice ale pielii care afectează oameni din întreaga lume. Această tulburare inflamatorie se manifestă de obicei sub formă de pete de piele uscată, cu mâncărime și inflamată, care pot afecta semnificativ calitatea vieții. Deși afecțiunea este cel mai frecvent diagnosticată la sugari și copii mici, poate persista până la vârsta adultă sau chiar se poate dezvolta pentru prima dată la adulți.","Fiziopatologia eczemei implică o interacțiune complexă între predispoziția genetică, disfuncția sistemului imunitar și factorii de mediu. Cercetările au identificat mutații în gena filaggrinei, care joacă un rol crucial în menținerea barierei pielii, ca un factor de risc semnificativ. Când această barieră este compromisă, pielea devine mai susceptibilă la iritanți, alergeni și colonizare microbiană.","A trăi cu eczemă necesită o abordare cuprinzătoare a managementului care depășește tratarea crizelor. Rutinele zilnice de îngrijire a pielii ar trebui să se concentreze pe menținerea hidratării și funcției de barieră a pielii. Aceasta implică de obicei aplicarea cremelor hidratante imediat după baie, în timp ce pielea este încă umedă, utilizarea produselor de curățare delicate, fără parfum, și evitarea factorilor declanșatori cunoscuți, cum ar fi săpunurile agresive, anumite țesături și temperaturile extreme.","Impactul psihologic al eczemei nu trebuie subestimat. Mâncărimea cronică poate perturba somnul, ducând la oboseală și dificultăți de concentrare. Leziunile cutanate vizibile pot provoca stânjeneală și anxietate socială, în special la copii și adolescenți. Furnizorii de servicii medicale recunosc din ce în ce mai mult importanța abordării acestor aspecte psihosociale ca parte a îngrijirii complete a eczemei.","Progresele recente în tratament au extins opțiunile pentru pacienții cu eczemă moderată până la severă. Medicamentele biologice, cum ar fi dupilumab, vizează componente specifice ale sistemului imunitar implicate în cascada inflamatorie. Aceste terapii au demonstrat o eficacitate remarcabilă în studiile clinice, oferind speranță pacienților care nu au răspuns adecvat la tratamentele convenționale.","Strategiile de prevenire se concentrează pe identificarea și evitarea factorilor declanșatori, menținând în același timp o sănătate optimă a pielii. Păstrarea unui jurnal al simptomelor poate ajuta pacienții și furnizorii lor de servicii medicale să identifice tiparele și potențialii factori declanșatori. Modificările de mediu, cum ar fi utilizarea purificatoarelor de aer și menținerea nivelurilor adecvate de umiditate, pot ajuta, de asemenea, la reducerea crizelor."]} },
              ],
            },
            {
              node: { code: 'rosacea', templateCode: 'condition', nodeTypeCode: 'entry', title: {"en":"Rosacea","ro":"Rozacee"}, slug: {"en":"rosacea","ro":"rozacee"}, subtitle: {"en":"Chronic facial redness","ro":"Roșeață facială cronică"}, sort: 1 },
              contents: [
                { blockCode: 'article', value: {"en":["Rosacea is a common but often misunderstood skin condition that affects an estimated 16 million Americans and 415 million people worldwide. Despite its prevalence, many people remain undiagnosed, often attributing their symptoms to sensitive skin, acne, or natural blushing.","The condition typically develops gradually, often beginning with a tendency to blush or flush more easily than others. Over time, the redness may become more persistent and visible blood vessels may appear. In some cases, bumps and pimples develop, leading to frequent misdiagnosis as adult acne.","There are four subtypes of rosacea, each with distinct characteristics. Erythematotelangiectatic rosacea involves flushing and persistent redness with visible blood vessels. Papulopustular rosacea resembles acne with redness, swelling, and breakouts. Phymatous rosacea causes skin thickening, particularly on the nose. Ocular rosacea affects the eyes, causing irritation and redness.","While there is no cure for rosacea, effective management strategies can significantly reduce symptoms and prevent progression. Identifying and avoiding personal triggers is crucial. Common triggers include sun exposure, stress, hot weather, wind, heavy exercise, alcohol, spicy foods, and certain skincare products.","Treatment typically begins with topical medications like metronidazole or azelaic acid, which reduce inflammation and redness. For more severe cases, oral antibiotics or isotretinoin may be prescribed. Laser and light therapies can effectively reduce visible blood vessels and persistent redness.","Living with rosacea requires ongoing attention to skincare. Gentle, fragrance-free products are recommended, along with daily broad-spectrum sunscreen. Many patients find that a consistent routine and trigger avoidance can dramatically improve their quality of life."],"ro":["Rozaceea este o afecțiune cutanată frecventă, dar adesea neînțeleasă, care afectează aproximativ 16 milioane de americani și 415 milioane de oameni din întreaga lume. În ciuda prevalenței sale, mulți oameni rămân nediagnosticați, atribuind adesea simptomele lor pielii sensibile, acneei sau înroșirii naturale.","Afecțiunea se dezvoltă de obicei treptat, începând adesea cu o tendință de a se înroși mai ușor decât alții. În timp, roșeața poate deveni mai persistentă și pot apărea vase de sânge vizibile. În unele cazuri, se dezvoltă umflături și coșuri, ducând la diagnosticarea greșită frecventă ca acnee la adulți.","Există patru subtipuri de rozacee, fiecare cu caracteristici distincte. Rozaceea eritematotelangiectazică implică înroșire și roșeață persistentă cu vase de sânge vizibile. Rozaceea papulopustulară seamănă cu acneea, cu roșeață, umflare și erupții. Rozaceea fimatoasă provoacă îngroșarea pielii, în special pe nas. Rozaceea oculară afectează ochii, provocând iritație și roșeață.","Deși nu există un tratament pentru rozacee, strategiile eficiente de management pot reduce semnificativ simptomele și pot preveni progresia. Identificarea și evitarea factorilor declanșatori personali este crucială. Factorii declanșatori comuni includ expunerea la soare, stresul, vremea caldă, vântul, exercițiile fizice intense, alcoolul, alimentele picante și anumite produse de îngrijire a pielii.","Tratamentul începe de obicei cu medicamente topice precum metronidazol sau acid azelaic, care reduc inflamația și roșeața. Pentru cazurile mai severe, pot fi prescrise antibiotice orale sau isotretinoin. Terapiile cu laser și lumină pot reduce eficient vasele de sânge vizibile și roșeața persistentă.","A trăi cu rozacee necesită o atenție continuă la îngrijirea pielii. Se recomandă produse delicate, fără parfum, împreună cu protecție solară zilnică cu spectru larg. Mulți pacienți constată că o rutină consecventă și evitarea factorilor declanșatori pot îmbunătăți dramatic calitatea vieții lor."]} },
                { blockCode: 'overview', value: {"en":"Rosacea is a chronic inflammatory skin condition that primarily affects the face, causing redness, visible blood vessels, and sometimes small, red, pus-filled bumps. It typically affects middle-aged women with fair skin but can affect anyone.","ro":"Rozaceea este o afecțiune inflamatorie cronică a pielii care afectează în principal fața, provocând roșeață, vase de sânge vizibile și uneori mici umflături roșii pline de puroi. Afectează de obicei femeile de vârstă mijlocie cu pielea deschisă, dar poate afecta pe oricine."} },
                { blockCode: 'causes', value: {"en":["Genetic predisposition","Immune system abnormalities","Demodex mites","Sun exposure","Spicy foods and alcohol","Temperature extremes"],"ro":["Predispoziție genetică","Anomalii ale sistemului imunitar","Acarieni Demodex","Expunerea la soare","Alimente picante și alcool","Temperaturi extreme"]} },
              ],
            },
            {
              node: { code: 'acne', templateCode: 'condition', nodeTypeCode: 'entry', title: {"en":"Acne","ro":"Acnee"}, slug: {"en":"acne","ro":"acnee"}, subtitle: {"en":"Common skin condition causing pimples and blemishes","ro":"Afecțiune cutanată comună care provoacă coșuri și imperfecțiuni"}, sort: 2 },
              contents: [
                { blockCode: 'article', value: {"en":"Acne vulgaris is one of the most common dermatological conditions worldwide, affecting approximately 85% of adolescents and young adults. While often dismissed as a cosmetic concern, acne can have significant psychological impacts, including reduced self-esteem and social anxiety. Understanding the pathophysiology of acne is crucial for effective treatment. The condition begins when sebaceous glands produce excess sebum, which combines with dead skin cells to block hair follicles. This creates an environment where Cutibacterium acnes bacteria thrive, leading to inflammation and the characteristic lesions: comedones (blackheads and whiteheads), papules, pustules, nodules, and cysts.","ro":"Acneea vulgară este una dintre cele mai frecvente afecțiuni dermatologice la nivel mondial, afectând aproximativ 85% din adolescenți și adulți tineri. Deși adesea considerată o preocupare cosmetică, acneea poate avea un impact psihologic semnificativ, incluzând scăderea stimei de sine și anxietate socială. Înțelegerea fiziopatologiei acneei este crucială pentru un tratament eficient. Afecțiunea începe când glandele sebacee produc exces de sebum, care se combină cu celulele moarte ale pielii pentru a bloca foliculii de păr. Aceasta creează un mediu în care bacteriile Cutibacterium acnes prosperă, ducând la inflamație și leziunile caracteristice: comedoane (puncte negre și albe), papule, pustule, noduli și chisturi."} },
                { blockCode: 'overview', value: {"en":"Acne is a chronic skin condition that occurs when hair follicles become clogged with oil and dead skin cells. It commonly appears on the face, chest, and back, affecting people of all ages but most prevalent during adolescence.","ro":"Acneea este o afecțiune cronică a pielii care apare când foliculii de păr se înfundă cu sebum și celule moarte. Apare frecvent pe față, piept și spate, afectând persoane de toate vârstele, dar cel mai frecvent în adolescență."} },
                { blockCode: 'causes', value: {"en":"Acne develops due to excess oil production, clogged pores, bacteria (Cutibacterium acnes), and inflammation. Hormonal changes, diet, stress, and certain medications can worsen the condition.","ro":"Acneea se dezvoltă din cauza producției excesive de sebum, porilor înfundați, bacteriilor (Cutibacterium acnes) și inflamației. Schimbările hormonale, dieta, stresul și anumite medicamente pot agrava afecțiunea."} },
              ],
            },
          ],
        },
        {
          node: { code: 'treatments', templateCode: 'section-template', nodeTypeCode: 'section', title: {"en":"Treatments","ro":"Tratamente"}, slug: {"en":"treatments","ro":"tratamente"}, notes: 'Medical treatments and therapies (e.g., Topical steroids, Phototherapy)', sort: 2 },
          contents: [
            { blockCode: 'description', value: {"en":"This section covers pharmacological treatments commonly used in dermatology, including their mechanisms of action and proper usage.","ro":"Aceasta sectiune acopera tratamentele farmacologice utilizate frecvent in dermatologie."} },
            { blockCode: 'introduction', value: {"en":"Modern dermatology offers a wide range of treatments for skin conditions, from topical medications to systemic therapies.","ro":"Dermatologia moderna ofera o gama larga de tratamente."} },
          ],
          children: [
            {
              node: { code: 'topical-corticosteroids', templateCode: 'treatment', nodeTypeCode: 'entry', title: {"en":"Topical Corticosteroids","ro":"Corticosteroizi topici"}, slug: {"en":"topical-corticosteroids","ro":"corticosteroizi-topici"}, subtitle: {"en":"Anti-inflammatory creams and ointments","ro":"Creme și unguente antiinflamatoare"}, sort: 0 },
              contents: [
                { blockCode: 'description', value: {"en":"Topical corticosteroids are anti-inflammatory medications applied directly to the skin. They reduce redness, swelling, and itching by suppressing the immune response in the affected area.","ro":"Corticosteroizii topici sunt medicamente antiinflamatoare aplicate direct pe piele. Reduc roșeața, umflarea și mâncărimea prin suprimarea răspunsului imunitar în zona afectată."} },
                { blockCode: 'indications', value: {"en":"Eczema, psoriasis, dermatitis, rosacea flare-ups, and various inflammatory skin conditions.","ro":"Eczemă, psoriazis, dermatită, crize de rozacee și diverse afecțiuni inflamatorii ale pielii."} },
                { blockCode: 'usage', value: {"en":"Apply a thin layer to affected areas 1-2 times daily. Do not use on broken skin or for extended periods without medical supervision.","ro":"Aplicați un strat subțire pe zonele afectate de 1-2 ori pe zi. Nu utilizați pe pielea lezată sau pentru perioade prelungite fără supraveghere medicală."} },
                { blockCode: 'side-effects', value: {"en":"Skin thinning, stretch marks, and increased susceptibility to infections with prolonged use. May cause skin discoloration.","ro":"Subțierea pielii, vergeturi și susceptibilitate crescută la infecții în cazul utilizării prelungite. Poate cauza decolorarea pielii."} },
              ],
            },
            {
              node: { code: 'moisturizers', templateCode: 'treatment', nodeTypeCode: 'entry', title: {"en":"Moisturizers","ro":"Hidratante"}, slug: {"en":"moisturizers","ro":"hidratante"}, subtitle: {"en":"Emollients for skin hydration","ro":"Emolienti pentru hidratarea pielii"}, sort: 1 },
              contents: [
                { blockCode: 'description', value: {"en":"Moisturizers help maintain skin hydration by trapping water in the outer layer of skin. They restore the skin barrier and reduce dryness and irritation.","ro":"Hidratantele ajută la menținerea hidratării pielii prin reținerea apei în stratul exterior al pielii. Restaurează bariera cutanată și reduc uscăciunea și iritația."} },
                { blockCode: 'indications', value: {"en":"Dry skin, eczema, psoriasis maintenance, and general skin care for inflammatory conditions.","ro":"Piele uscată, eczemă, întreținerea psoriazisului și îngrijirea generală a pielii pentru afecțiuni inflamatorii."} },
                { blockCode: 'usage', value: {"en":"Apply liberally after bathing and throughout the day as needed. Best applied to slightly damp skin.","ro":"Aplicați generos după baie și pe parcursul zilei, după necesități. Se aplică cel mai bine pe pielea ușor umedă."} },
                { blockCode: 'side-effects', value: {"en":"Generally well-tolerated. Some products may cause irritation in sensitive individuals.","ro":"În general bine tolerate. Unele produse pot cauza iritații la persoanele sensibile."} },
              ],
            },
            {
              node: { code: 'retinoids', templateCode: 'treatment', nodeTypeCode: 'entry', title: {"en":"Retinoids","ro":"Retinoizi"}, slug: {"en":"retinoids","ro":"retinoizi"}, subtitle: {"en":"Vitamin A derivatives for skin renewal","ro":"Derivați de vitamina A pentru reînnoirea pielii"}, sort: 2 },
              contents: [
                { blockCode: 'description', value: {"en":"Retinoids are vitamin A derivatives that promote cell turnover and prevent clogging of hair follicles. They are highly effective for acne and skin aging.","ro":"Retinoizii sunt derivați ai vitaminei A care promovează reînnoirea celulară și previn înfundarea foliculilor de păr. Sunt foarte eficienți pentru acnee și îmbătrânirea pielii."} },
                { blockCode: 'indications', value: {"en":"Acne, fine lines and wrinkles, sun damage, and uneven skin tone.","ro":"Acnee, linii fine și riduri, leziuni solare și tonul neuniform al pielii."} },
                { blockCode: 'usage', value: {"en":"Apply a pea-sized amount at night. Start with every other day and gradually increase frequency. Always use sunscreen during the day.","ro":"Aplicați o cantitate cât un bob de mazăre seara. Începeți cu o zi da, una nu și creșteți treptat frecvența. Utilizați întotdeauna protecție solară în timpul zilei."} },
                { blockCode: 'side-effects', value: {"en":"Dryness, peeling, redness, and increased sun sensitivity. Not recommended during pregnancy.","ro":"Uscăciune, descuamare, roșeață și sensibilitate crescută la soare. Nu se recomandă în timpul sarcinii."} },
              ],
            },
          ],
        },
        {
          node: { code: 'signs-symptoms', templateCode: 'section-template', nodeTypeCode: 'section', title: {"en":"Signs & Symptoms","ro":"Semne si Simptome"}, slug: {"en":"signs-symptoms","ro":"semne-si-simptome"}, notes: 'Clinical signs and symptoms (e.g., Rash, Itching, Redness)', sort: 3 },
          contents: [
            { blockCode: 'introduction', value: {"en":"Recognizing the signs and symptoms of skin conditions is the first step toward proper diagnosis and treatment.","ro":"Recunoasterea semnelor si simptomelor afectiunilor pielii este primul pas."} },
            { blockCode: 'description', value: {"en":"This section describes common dermatological signs and symptoms, helping you identify what your skin might be telling you.","ro":"Aceasta sectiune descrie semnele si simptomele dermatologice comune."} },
          ],
          children: [
            {
              node: { code: 'itching', templateCode: 'symptom', nodeTypeCode: 'entry', title: {"en":"Itching","ro":"Mâncărime"}, slug: {"en":"itching","ro":"mancarime"}, subtitle: {"en":"Pruritus","ro":"Prurit"}, sort: 0 },
              contents: [
                { blockCode: 'description', value: {"en":"An uncomfortable sensation on the skin that creates an urge to scratch. It can range from mild to severe and may be localized or widespread.","ro":"O senzație neplăcută pe piele care creează dorința de a se scărpina. Poate varia de la ușoară la severă și poate fi localizată sau răspândită."} },
              ],
            },
            {
              node: { code: 'redness', templateCode: 'symptom', nodeTypeCode: 'entry', title: {"en":"Redness","ro":"Roșeață"}, slug: {"en":"redness","ro":"roseata"}, subtitle: {"en":"Erythema","ro":"Eritem"}, sort: 1 },
              contents: [
                { blockCode: 'description', value: {"en":"Reddening of the skin caused by increased blood flow to the capillaries. Often accompanies inflammation or irritation.","ro":"Înroșirea pielii cauzată de creșterea fluxului sanguin către capilare. Adesea însoțește inflamația sau iritația."} },
              ],
            },
            {
              node: { code: 'dry-skin', templateCode: 'symptom', nodeTypeCode: 'entry', title: {"en":"Dry Skin","ro":"Piele Uscată"}, slug: {"en":"dry-skin","ro":"piele-uscata"}, subtitle: {"en":"Xerosis","ro":"Xeroză"}, sort: 2 },
              contents: [
                { blockCode: 'description', value: {"en":"Skin that lacks moisture, appearing rough, scaly, or flaky. Can cause discomfort and increase susceptibility to irritation.","ro":"Piele căreia îi lipsește umiditatea, având un aspect aspru, solzos sau care se descuamează. Poate provoca disconfort și poate crește susceptibilitatea la iritație."} },
              ],
            },
            {
              node: { code: 'swelling', templateCode: 'symptom', nodeTypeCode: 'entry', title: {"en":"Swelling","ro":"Umflare"}, slug: {"en":"swelling","ro":"umflare"}, subtitle: {"en":"Edema","ro":"Edem"}, sort: 3 },
              contents: [
                { blockCode: 'description', value: {"en":"Enlargement of a body part due to fluid accumulation in tissues. Often occurs alongside inflammation.","ro":"Mărirea unei părți a corpului datorită acumulării de lichid în țesuturi. Apare adesea împreună cu inflamația."} },
              ],
            },
            {
              node: { code: 'scaling', templateCode: 'symptom', nodeTypeCode: 'entry', title: {"en":"Scaling","ro":"Descuamare"}, slug: {"en":"scaling","ro":"descuamare"}, subtitle: {"en":"Desquamation","ro":"Descuamație"}, sort: 4 },
              contents: [
                { blockCode: 'description', value: {"en":"Shedding of the outer layer of skin in flakes or scales. Common in conditions affecting skin cell turnover.","ro":"Desprinderea stratului exterior al pielii sub formă de fulgi sau solzi. Frecventă în afecțiunile care afectează reînnoirea celulelor pielii."} },
              ],
            },
          ],
        },
        {
          node: { code: 'procedures', templateCode: 'section-template', nodeTypeCode: 'section', title: {"en":"Procedures","ro":"Proceduri"}, slug: {"en":"procedures","ro":"proceduri"}, notes: 'Diagnostic and therapeutic procedures (e.g., Biopsy, Cryotherapy)', sort: 4 },
          contents: [
            { blockCode: 'introduction', value: {"en":"Dermatological procedures range from simple diagnostic tests to advanced therapeutic interventions.","ro":"Procedurile dermatologice variaza de la teste de diagnostic simple pana la interventii terapeutice avansate."} },
            { blockCode: 'description', value: {"en":"This section covers both diagnostic and therapeutic procedures used in dermatology.","ro":"Aceasta sectiune acopera atat procedurile de diagnostic, cat si cele terapeutice."} },
          ],
          children: [
            {
              node: { code: 'phototherapy', templateCode: 'procedure-template', nodeTypeCode: 'entry', title: {"en":"Phototherapy","ro":"Fototerapie"}, slug: {"en":"phototherapy","ro":"fototerapie"}, sort: 0 },
              contents: [
                { blockCode: 'description', value: {"en":"Phototherapy uses controlled ultraviolet (UV) light to treat various skin conditions. The treatment involves exposing affected skin to specific wavelengths of UV light under medical supervision.","ro":"Fototerapia folosește lumina ultravioletă (UV) controlată pentru a trata diverse afecțiuni ale pielii."} },
                { blockCode: 'indications', value: {"en":"Recommended for moderate to severe eczema, psoriasis, vitiligo, and certain other inflammatory skin conditions that have not responded adequately to topical treatments.","ro":"Recomandat pentru eczeme moderate până la severe, psoriazis, vitiligo."} },
                { blockCode: 'technique', value: {"en":"Patient stands in a light booth or has affected areas exposed to UVB or UVA light. Sessions typically last a few minutes and are performed 2-3 times per week. Treatment course usually spans 6-12 weeks.","ro":"Pacientul stă într-o cabină de lumină sau are zonele afectate expuse la lumină UVB sau UVA."} },
                { blockCode: 'risks', value: {"en":"Skin redness and burning (similar to sunburn), premature skin aging with long-term use, slightly increased risk of skin cancer with extensive treatment, eye damage if proper protection not used.","ro":"Roșeață și arsuri ale pielii, îmbătrânire prematură a pielii."} },
                { blockCode: 'recovery', value: {"en":"No downtime required. Skin may be slightly pink after treatment. Moisturizer should be applied. Sun exposure should be limited on treatment days.","ro":"Nu este necesară recuperare. Pielea poate fi ușor roz după tratament."} },
              ],
            },
            {
              node: { code: 'cryotherapy', templateCode: 'procedure-template', nodeTypeCode: 'entry', title: {"en":"Cryotherapy","ro":"Crioterapie"}, slug: {"en":"cryotherapy","ro":"crioterapie"}, sort: 1 },
              contents: [
                { blockCode: 'description', value: {"en":"Cryotherapy uses extreme cold (typically liquid nitrogen) to freeze and destroy abnormal skin tissue. It is a quick, in-office procedure commonly used for various skin lesions.","ro":"Crioterapia folosește frig extrem (de obicei azot lichid) pentru a îngheța și distruge țesutul cutanat anormal."} },
                { blockCode: 'indications', value: {"en":"Effective for warts, actinic keratoses, seborrheic keratoses, skin tags, and some superficial skin cancers. Can also be used for inflammatory acne cysts.","ro":"Eficient pentru veruci, keratoze actinice, keratoze seboreice."} },
                { blockCode: 'technique', value: {"en":"Liquid nitrogen is applied directly to the lesion using a spray device or cotton-tipped applicator. The freezing typically lasts 5-30 seconds depending on the lesion size and type.","ro":"Azotul lichid este aplicat direct pe leziune folosind un dispozitiv de pulverizare."} },
                { blockCode: 'risks', value: {"en":"Pain and stinging during procedure, blistering, temporary or permanent skin lightening (hypopigmentation), scarring in rare cases, nerve damage if applied too deeply.","ro":"Durere și înțepături în timpul procedurii, vezicule, deschiderea la culoare a pielii."} },
                { blockCode: 'recovery', value: {"en":"Treated area may blister and scab over 1-2 weeks. Keep area clean and dry. Healing typically complete within 2-4 weeks. Avoid picking at scabs.","ro":"Zona tratată poate forma vezicule și cruste în 1-2 săptămâni."} },
              ],
            },
            {
              node: { code: 'laser-therapy', templateCode: 'procedure-template', nodeTypeCode: 'entry', title: {"en":"Laser Therapy","ro":"Terapie cu Laser"}, slug: {"en":"laser-therapy","ro":"terapie-cu-laser"}, sort: 2 },
              contents: [
                { blockCode: 'description', value: {"en":"Laser therapy uses focused light energy to treat various skin conditions. Different laser types target specific skin concerns including blood vessels, pigmentation, and collagen production.","ro":"Terapia cu laser folosește energie luminoasă focalizată pentru a trata diverse afecțiuni ale pielii."} },
                { blockCode: 'indications', value: {"en":"Rosacea with visible blood vessels, acne scars, hyperpigmentation, unwanted hair, vascular lesions, and skin rejuvenation.","ro":"Rozacee cu vase de sânge vizibile, cicatrici de acnee, hiperpigmentare."} },
                { blockCode: 'technique', value: {"en":"A handheld laser device is passed over the treatment area. Protective eyewear is required. Sessions last 15-60 minutes depending on the area and condition being treated.","ro":"Un dispozitiv laser portabil este trecut peste zona de tratament."} },
                { blockCode: 'risks', value: {"en":"Redness and swelling, blistering, temporary skin darkening or lightening, scarring (rare), infection (rare). Results may require multiple sessions.","ro":"Roșeață și umflături, vezicule, întunecarea sau deschiderea temporară a pielii."} },
                { blockCode: 'recovery', value: {"en":"Redness and mild swelling may last 1-3 days. Avoid sun exposure for 2-4 weeks. Use gentle skincare and SPF. Full results visible after 2-6 weeks.","ro":"Roșeața și umflăturile ușoare pot dura 1-3 zile."} },
              ],
            },
            {
              node: { code: 'skin-biopsy', templateCode: 'procedure-template', nodeTypeCode: 'entry', title: {"en":"Skin Biopsy","ro":"Biopsie Cutanată"}, slug: {"en":"skin-biopsy","ro":"biopsie-cutanata"}, sort: 3 },
              contents: [
                { blockCode: 'description', value: {"en":"A skin biopsy is a diagnostic procedure where a small sample of skin tissue is removed and examined under a microscope. It helps identify the cause of skin conditions and rule out serious diseases.","ro":"Biopsia cutanată este o procedură de diagnostic în care o mică probă de țesut cutanat este îndepărtată și examinată la microscop."} },
                { blockCode: 'indications', value: {"en":"Used to diagnose skin cancers, inflammatory conditions, infections, and to confirm suspected diagnoses when clinical examination is inconclusive.","ro":"Folosită pentru diagnosticarea cancerelor de piele, afecțiunilor inflamatorii, infecțiilor."} },
                { blockCode: 'technique', value: {"en":"After local anesthesia, tissue is removed using punch biopsy (circular blade), shave biopsy (horizontal slice), or excisional biopsy (entire lesion removed). Sample is sent to pathology lab.","ro":"După anestezie locală, țesutul este îndepărtat folosind biopsie prin puncție, biopsie prin radere sau biopsie excizională."} },
                { blockCode: 'risks', value: {"en":"Bleeding, infection, scarring, nerve damage (rare). Allergic reaction to anesthesia (rare).","ro":"Sângerare, infecție, cicatrizare, leziuni nervoase (rar)."} },
                { blockCode: 'recovery', value: {"en":"Keep wound clean and dry. Stitches (if used) removed in 7-14 days. Results typically available in 1-2 weeks. Minimal activity restrictions.","ro":"Mențineți rana curată și uscată. Firele (dacă sunt folosite) sunt îndepărtate în 7-14 zile."} },
              ],
            },
            {
              node: { code: 'dermoscopy', templateCode: 'procedure-template', nodeTypeCode: 'entry', title: {"en":"Dermoscopy","ro":"Dermatoscopie"}, slug: {"en":"dermoscopy","ro":"dermatoscopie"}, sort: 4 },
              contents: [
                { blockCode: 'description', value: {"en":"Dermoscopy is a non-invasive diagnostic technique using a specialized magnifying device (dermatoscope) to examine skin lesions in detail. It allows visualization of structures not visible to the naked eye.","ro":"Dermatoscopia este o tehnică de diagnostic non-invazivă care folosește un dispozitiv de mărire specializat pentru a examina leziunile cutanate în detaliu."} },
                { blockCode: 'indications', value: {"en":"Evaluation of moles and pigmented lesions, early detection of melanoma and other skin cancers, assessment of inflammatory skin conditions, and monitoring changes in lesions over time.","ro":"Evaluarea alunițelor și leziunilor pigmentate, detectarea precoce a melanomului."} },
                { blockCode: 'technique', value: {"en":"A handheld dermatoscope is placed directly on or near the skin. Images may be captured digitally for documentation and comparison. The examination is painless and takes only a few minutes.","ro":"Un dermatoscop portabil este plasat direct pe sau lângă piele."} },
                { blockCode: 'risks', value: {"en":"No risks. This is a completely non-invasive examination with no side effects.","ro":"Fără riscuri. Aceasta este o examinare complet non-invazivă fără efecte secundare."} },
                { blockCode: 'recovery', value: {"en":"No recovery needed. Normal activities can be resumed immediately. Follow-up appointments may be scheduled to monitor specific lesions.","ro":"Nu este necesară recuperare. Activitățile normale pot fi reluate imediat."} },
              ],
            },
            {
              node: { code: 'patch-testing', templateCode: 'procedure-template', nodeTypeCode: 'entry', title: {"en":"Patch Testing","ro":"Testare Patch"}, slug: {"en":"patch-testing","ro":"testare-patch"}, sort: 5 },
              contents: [
                { blockCode: 'description', value: {"en":"Patch testing is a diagnostic method used to identify substances that cause allergic contact dermatitis. Small amounts of potential allergens are applied to the skin under adhesive patches.","ro":"Testarea patch este o metodă de diagnostic folosită pentru a identifica substanțele care cauzează dermatita de contact alergică."} },
                { blockCode: 'indications', value: {"en":"Suspected allergic contact dermatitis, chronic eczema of unknown cause, occupational skin disease, reaction to cosmetics or personal care products.","ro":"Suspiciune de dermatită de contact alergică, eczemă cronică de cauză necunoscută."} },
                { blockCode: 'technique', value: {"en":"Patches containing small amounts of common allergens are applied to the back. Patches remain in place for 48 hours, then removed. Skin is examined at 48 hours and again at 72-96 hours.","ro":"Plasturi conținând cantități mici de alergeni comuni sunt aplicați pe spate."} },
                { blockCode: 'risks', value: {"en":"Itching and irritation at test sites, potential for strong allergic reaction (rare), temporary skin discoloration at patch sites.","ro":"Mâncărime și iritație la locurile de testare, potențial pentru reacție alergică puternică (rar)."} },
                { blockCode: 'recovery', value: {"en":"Avoid getting test area wet during the 48-hour patch period. Mild reactions at positive test sites resolve within 1-2 weeks. Avoid known allergens based on results.","ro":"Evitați să udați zona de testare în timpul perioadei de 48 de ore."} },
              ],
            },
          ],
        },
      ],
      relationTypes: [
        { code: 'diagnoses', title: {"en":"Diagnoses","ro":"Diagnostichează"}, reverse_title: {"en":"Diagnosed by","ro":"Diagnosticat prin"} },
        { code: 'procedure-for', title: {"en":"Procedure for","ro":"Procedură pentru"}, reverse_title: {"en":"Treated by procedure","ro":"Tratat cu procedură"} },
        { code: 'signs-symptoms-of', title: {"en":"Sign/symptom of","ro":"Semn/simptom al"}, reverse_title: {"en":"Has signs/symptoms","ro":"Are semne/simptome"}, notes: 'Links conditions to their signs and symptoms' },
        { code: 'treatment-for', title: {"en":"Treatment for","ro":"Tratament pentru"}, reverse_title: {"en":"Treated by treatment","ro":"Tratat cu tratament"}, notes: 'Links treatments to conditions they treat' },
      ],
      relations: [
        { relationTypeCode: 'signs-symptoms-of', fromNodeCode: 'itching', toNodeCode: 'eczema' },
        { relationTypeCode: 'signs-symptoms-of', fromNodeCode: 'redness', toNodeCode: 'eczema' },
        { relationTypeCode: 'signs-symptoms-of', fromNodeCode: 'dry-skin', toNodeCode: 'eczema' },
        { relationTypeCode: 'signs-symptoms-of', fromNodeCode: 'swelling', toNodeCode: 'eczema' },
        { relationTypeCode: 'signs-symptoms-of', fromNodeCode: 'scaling', toNodeCode: 'eczema' },
        { relationTypeCode: 'signs-symptoms-of', fromNodeCode: 'redness', toNodeCode: 'rosacea' },
        { relationTypeCode: 'signs-symptoms-of', fromNodeCode: 'swelling', toNodeCode: 'rosacea' },
        { relationTypeCode: 'signs-symptoms-of', fromNodeCode: 'redness', toNodeCode: 'acne' },
        { relationTypeCode: 'signs-symptoms-of', fromNodeCode: 'swelling', toNodeCode: 'acne' },
        { relationTypeCode: 'treatment-for', fromNodeCode: 'topical-corticosteroids', toNodeCode: 'eczema' },
        { relationTypeCode: 'treatment-for', fromNodeCode: 'topical-corticosteroids', toNodeCode: 'rosacea' },
        { relationTypeCode: 'treatment-for', fromNodeCode: 'moisturizers', toNodeCode: 'eczema' },
        { relationTypeCode: 'treatment-for', fromNodeCode: 'retinoids', toNodeCode: 'acne' },
        { relationTypeCode: 'procedure-for', fromNodeCode: 'phototherapy', toNodeCode: 'eczema' },
        { relationTypeCode: 'procedure-for', fromNodeCode: 'phototherapy', toNodeCode: 'rosacea' },
        { relationTypeCode: 'procedure-for', fromNodeCode: 'cryotherapy', toNodeCode: 'acne' },
        { relationTypeCode: 'procedure-for', fromNodeCode: 'laser-therapy', toNodeCode: 'rosacea' },
        { relationTypeCode: 'procedure-for', fromNodeCode: 'laser-therapy', toNodeCode: 'acne' },
        { relationTypeCode: 'diagnoses', fromNodeCode: 'skin-biopsy', toNodeCode: 'eczema' },
        { relationTypeCode: 'diagnoses', fromNodeCode: 'skin-biopsy', toNodeCode: 'rosacea' },
        { relationTypeCode: 'diagnoses', fromNodeCode: 'skin-biopsy', toNodeCode: 'acne' },
        { relationTypeCode: 'diagnoses', fromNodeCode: 'dermoscopy', toNodeCode: 'acne' },
        { relationTypeCode: 'diagnoses', fromNodeCode: 'dermoscopy', toNodeCode: 'rosacea' },
        { relationTypeCode: 'diagnoses', fromNodeCode: 'patch-testing', toNodeCode: 'eczema' },
      ],
    },
    {
      collection: { code: 'articles', sort: 2, notes: 'Blog posts and news articles' },
      templates: [
        {
          template: { code: 'article', title: {"en":"Article","ro":"Articol"}, notes: 'Template for blog articles' },
          blocks: [
            {
              block: { code: 'summary', title: {"en":"Summary","ro":"Rezumat"}, content_type: 'text', sort: 0, notes: 'Brief summary of the article' },
            },
            {
              block: { code: 'body', title: {"en":"Body","ro":"Conținut"}, content_type: 'text_list', sort: 1, notes: 'Main content of the article' },
            },
          ],
        },
      ],
      nodes: [
        {
          node: { code: 'sun-exposure', templateCode: 'article', nodeTypeCode: 'article', title: {"en":"Sun Exposure and Skin Health","ro":"Expunerea la Soare și Sănătatea Pielii"}, slug: {"en":"sun-exposure-and-skin-health","ro":"expunerea-la-soare-i-s-n-tatea-pielii"}, subtitle: {"en":"Understanding the risks and benefits of sunlight","ro":"Înțelegerea riscurilor și beneficiilor luminii solare"}, notes: 'Demo article for testing purposes', sort: 0 },
          contents: [
            { blockCode: 'summary', value: {"en":"While sunlight is essential for vitamin D production and overall well-being, excessive sun exposure can lead to serious skin damage. Learn how to protect yourself while still enjoying the outdoors.","ro":"Deși lumina solară este esențială pentru producerea vitaminei D și bunăstarea generală, expunerea excesivă la soare poate duce la leziuni grave ale pielii. Aflați cum să vă protejați în timp ce vă bucurați de aer liber."} },
            { blockCode: 'body', value: {"en":["The sun emits ultraviolet (UV) radiation that can penetrate the skin and cause damage at the cellular level. There are two main types of UV rays that affect the skin: UVA rays, which cause premature aging, and UVB rays, which cause sunburn.","Repeated sun exposure without protection can lead to various skin conditions, including sunburn, premature aging (photoaging), actinic keratosis, and skin cancer. Melanoma, the most dangerous form of skin cancer, is strongly linked to intense, intermittent sun exposure and sunburns.","To protect your skin, dermatologists recommend using a broad-spectrum sunscreen with SPF 30 or higher, wearing protective clothing, seeking shade during peak sun hours (10 AM to 4 PM), and avoiding tanning beds.","However, moderate sun exposure has benefits too. Sunlight triggers vitamin D synthesis in the skin, which is essential for bone health and immune function. The key is finding a balance that allows you to get enough vitamin D while minimizing skin damage."],"ro":["Soarele emite radiații ultraviolete (UV) care pot pătrunde în piele și pot cauza daune la nivel celular. Există două tipuri principale de raze UV care afectează pielea: razele UVA, care cauzează îmbătrânirea prematură, și razele UVB, care cauzează arsurile solare.","Expunerea repetată la soare fără protecție poate duce la diverse afecțiuni ale pielii, inclusiv arsuri solare, îmbătrânire prematură (fotoîmbătrânire), keratoză actinică și cancer de piele. Melanomul, cea mai periculoasă formă de cancer de piele, este puternic legat de expunerea intensă și intermitentă la soare și de arsurile solare.","Pentru a vă proteja pielea, dermatologii recomandă utilizarea unei creme de protecție solară cu spectru larg cu SPF 30 sau mai mare, purtarea îmbrăcămintei de protecție, căutarea umbrei în orele de vârf ale soarelui (10:00 - 16:00) și evitarea solarelor.","Cu toate acestea, expunerea moderată la soare are și beneficii. Lumina solară declanșează sinteza vitaminei D în piele, care este esențială pentru sănătatea oaselor și funcția imunitară. Cheia este găsirea unui echilibru care vă permite să obțineți suficientă vitamină D, minimizând în același timp deteriorarea pielii."]} },
          ],
        },
        {
          node: { code: 'skincare-routine', templateCode: 'article', nodeTypeCode: 'article', title: {"en":"Building an Effective Skincare Routine","ro":"Construirea unei Rutine Eficiente de Îngrijire a Pielii"}, slug: {"en":"building-an-effective-skincare-routine","ro":"construirea-unei-rutine-eficiente-de-ngrijire-a-pielii"}, subtitle: {"en":"Essential steps for healthy skin at any age","ro":"Pași esențiali pentru o piele sănătoasă la orice vârstă"}, notes: 'Demo article for testing purposes', sort: 1 },
          contents: [
            { blockCode: 'summary', value: {"en":"A consistent skincare routine is the foundation of healthy skin. Whether you are dealing with acne, aging, or simply want to maintain your skin health, understanding the basics can make all the difference.","ro":"O rutină consecventă de îngrijire a pielii este fundația unei pieli sănătoase. Fie că vă confruntați cu acnee, îmbătrânire sau pur și simplu doriți să vă mențineți sănătatea pielii, înțelegerea bazelor poate face toată diferența."} },
            { blockCode: 'body', value: {"en":["The basic skincare routine consists of three essential steps: cleansing, moisturizing, and sun protection. Cleansing removes dirt, oil, and impurities that accumulate on your skin throughout the day. Choose a gentle cleanser that matches your skin type.","Moisturizing is crucial for all skin types, even oily skin. A good moisturizer helps maintain your skin barrier and keeps your skin hydrated. Look for ingredients like hyaluronic acid, ceramides, and glycerin.","Sunscreen is perhaps the most important step in any skincare routine. Daily use of broad-spectrum SPF 30 or higher protects against premature aging, hyperpigmentation, and skin cancer. Apply it every morning, even on cloudy days.","As you become more comfortable with the basics, you can add targeted treatments like serums with vitamin C for brightening, retinoids for anti-aging, or niacinamide for pore control. Introduce new products one at a time to monitor how your skin reacts."],"ro":["Rutina de bază pentru îngrijirea pielii constă din trei pași esențiali: curățare, hidratare și protecție solară. Curățarea elimină murdăria, sebumul și impuritățile care se acumulează pe piele pe parcursul zilei. Alegeți un produs de curățare delicat care se potrivește tipului dumneavoastră de piele.","Hidratarea este crucială pentru toate tipurile de piele, chiar și pentru pielea grasă. O cremă hidratantă bună ajută la menținerea barierei pielii și păstrează pielea hidratată. Căutați ingrediente precum acidul hialuronic, ceramidele și glicerina.","Protecția solară este probabil cel mai important pas din orice rutină de îngrijire a pielii. Utilizarea zilnică a unui produs cu SPF 30 sau mai mare cu spectru larg protejează împotriva îmbătrânirii premature, hiperpigmentării și cancerului de piele. Aplicați-l în fiecare dimineață, chiar și în zilele înnorate.","Pe măsură ce vă obișnuiți cu bazele, puteți adăuga tratamente țintite precum seruri cu vitamina C pentru luminozitate, retinoizi pentru anti-îmbătrânire sau niacinamidă pentru controlul porilor. Introduceți produse noi unul câte unul pentru a monitoriza cum reacționează pielea."]} },
          ],
        },
        {
          node: { code: 'acne-treatment', templateCode: 'article', nodeTypeCode: 'article', title: {"en":"Understanding and Treating Acne","ro":"Înțelegerea și Tratarea Acneei"}, slug: {"en":"understanding-and-treating-acne","ro":"n-elegerea-i-tratarea-acneei"}, subtitle: {"en":"From causes to effective treatments","ro":"De la cauze la tratamente eficiente"}, notes: 'Demo article for testing purposes', sort: 2 },
          contents: [
            { blockCode: 'summary', value: {"en":"Acne is one of the most common skin conditions, affecting millions of people worldwide. Understanding what causes acne and the available treatment options can help you achieve clearer skin.","ro":"Acneea este una dintre cele mai frecvente afecțiuni ale pielii, afectând milioane de oameni din întreaga lume. Înțelegerea cauzelor acneei și a opțiunilor de tratament disponibile vă poate ajuta să obțineți o piele mai curată."} },
            { blockCode: 'body', value: {"en":["Acne develops when hair follicles become clogged with oil and dead skin cells. Factors that can trigger or worsen acne include hormonal changes, certain medications, diet, and stress. Contrary to popular belief, acne is not caused by dirty skin or eating chocolate.","Treatment options range from over-the-counter products to prescription medications. Benzoyl peroxide and salicylic acid are common ingredients in OTC treatments that help kill bacteria and unclog pores. For more severe cases, dermatologists may prescribe retinoids, antibiotics, or hormonal treatments.","A consistent skincare routine is essential for managing acne. Wash your face twice daily with a gentle cleanser, avoid touching your face, and resist the urge to pick or squeeze pimples, as this can lead to scarring and infection.","If over-the-counter treatments are not effective after 2-3 months, consult a dermatologist. They can recommend stronger treatments and rule out other conditions that may look like acne, such as rosacea or folliculitis."],"ro":["Acneea se dezvoltă atunci când foliculii de păr se înfundă cu sebum și celule moarte ale pielii. Factorii care pot declanșa sau agrava acneea includ schimbările hormonale, anumite medicamente, dieta și stresul. Contrar credinței populare, acneea nu este cauzată de pielea murdară sau de consumul de ciocolată.","Opțiunile de tratament variază de la produse fără prescripție la medicamente cu prescripție. Peroxidul de benzoil și acidul salicilic sunt ingrediente comune în tratamentele fără prescripție care ajută la uciderea bacteriilor și la destuparea porilor. Pentru cazurile mai severe, dermatologii pot prescrie retinoizi, antibiotice sau tratamente hormonale.","O rutină consecventă de îngrijire a pielii este esențială pentru gestionarea acneei. Spălați-vă fața de două ori pe zi cu un produs de curățare delicat, evitați să vă atingeți fața și rezistați impulsului de a stoarce coșurile, deoarece acest lucru poate duce la cicatrici și infecții.","Dacă tratamentele fără prescripție nu sunt eficiente după 2-3 luni, consultați un dermatolog. Acesta vă poate recomanda tratamente mai puternice și poate exclude alte afecțiuni care pot arăta ca acneea, cum ar fi rozaceea sau foliculita."]} },
          ],
        },
      ],
    },
    {
      collection: { code: 'general', sort: 3, notes: 'Static pages (About, Contact, Privacy Policy, etc.)' },
      templates: [
        {
          template: { code: 'about-page', title: {"en":"About Page","ro":"Pagină Despre"}, notes: 'Template for general pages' },
          blocks: [
            {
              block: { code: 'content', title: {"en":"Content","ro":"Conținut"}, content_type: 'text_list', sort: 0, notes: 'Main content of the page' },
            },
          ],
        },
        {
          template: { code: 'hero', title: {"en":"Hero","ro":"Hero"}, notes: 'Template for homepage hero section' },
          blocks: [
            {
              block: { code: 'headline', title: {"en":"Headline","ro":"Titlu Principal"}, content_type: 'text', sort: 0, notes: 'Main headline text' },
            },
            {
              block: { code: 'subheadline', title: {"en":"Subheadline","ro":"Subtitlu"}, content_type: 'text', sort: 1, notes: 'Secondary headline text' },
            },
            {
              block: { code: 'cta-link', title: {"en":"CTA Link","ro":"Link CTA"}, content_type: 'text', sort: 2, notes: 'Call-to-action link URL' },
            },
          ],
        },
      ],
      nodes: [
        {
          node: { code: 'about', templateCode: 'about-page', nodeTypeCode: 'page', title: {"en":"About","ro":"Despre"}, slug: {"en":"about","ro":"despre"}, subtitle: {"en":"Learn more about DermaPedia","ro":"Aflați mai multe despre DermaPedia"}, notes: 'About page for the dermatology website', sort: 0 },
          contents: [
            { blockCode: 'content', value: {"en":["Welcome to DermaPedia, your trusted resource for dermatology information. Our mission is to provide accurate, accessible, and up-to-date information about skin health, conditions, and treatments.","Whether you are a patient seeking to understand a diagnosis, a caregiver looking for reliable information, or simply someone interested in skin health, DermaPedia is here to help.","Our content is developed and reviewed by dermatology professionals to ensure accuracy and relevance. We cover a wide range of topics from common conditions like acne and eczema to more complex dermatological issues.","Please note that the information provided here is for educational purposes only and should not replace professional medical advice. Always consult a qualified dermatologist for diagnosis and treatment of skin conditions."],"ro":["Bine ați venit la DermaPedia, resursa dumneavoastră de încredere pentru informații dermatologice. Misiunea noastră este să oferim informații precise, accesibile și actualizate despre sănătatea pielii, afecțiuni și tratamente.","Fie că sunteți un pacient care dorește să înțeleagă un diagnostic, un îngrijitor care caută informații de încredere sau pur și simplu cineva interesat de sănătatea pielii, DermaPedia este aici să vă ajute.","Conținutul nostru este dezvoltat și revizuit de profesioniști în dermatologie pentru a asigura acuratețea și relevanța. Acoperim o gamă largă de subiecte, de la afecțiuni comune precum acneea și eczema până la probleme dermatologice mai complexe.","Vă rugăm să rețineți că informațiile furnizate aici sunt doar în scop educativ și nu ar trebui să înlocuiască sfatul medical profesional. Consultați întotdeauna un dermatolog calificat pentru diagnosticul și tratamentul afecțiunilor pielii."]} },
          ],
        },
        {
          node: { code: 'homepage-hero', templateCode: 'hero', nodeTypeCode: 'page', slug: {"en":"homepage-hero","ro":"hero-pagin-principal"}, notes: 'Hero section for the homepage', sort: 1 },
          contents: [
            { blockCode: 'headline', value: {"en":"Your Skin Health Matters","ro":"Sănătatea Pielii Tale Contează"} },
            { blockCode: 'subheadline', value: {"en":"Expert dermatology information for healthier skin","ro":"Informații dermatologice de specialitate pentru o piele mai sănătoasă"} },
            { blockCode: 'cta-link', value: {"en":"/encyclopedia","ro":"/encyclopedia"} },
          ],
        },
      ],
    },
    {
      collection: { code: 'glossary', sort: 3, notes: 'Glossary of dermatology terms' },
      templates: [
        {
          template: { code: 'procedure-template', title: {"en":"Procedure Template","ro":"Șablon Procedură"} },
          blocks: [
            {
              block: { code: 'description', title: {"en":"Description","ro":"Descriere"}, content_type: 'text', sort: 1 },
            },
            {
              block: { code: 'indications', title: {"en":"Indications","ro":"Indicații"}, content_type: 'text', sort: 2 },
            },
            {
              block: { code: 'technique', title: {"en":"Technique","ro":"Tehnică"}, content_type: 'text', sort: 3 },
            },
            {
              block: { code: 'risks', title: {"en":"Risks & Side Effects","ro":"Riscuri și Efecte Secundare"}, content_type: 'text', sort: 4 },
            },
            {
              block: { code: 'recovery', title: {"en":"Recovery","ro":"Recuperare"}, content_type: 'text', sort: 5 },
            },
          ],
        },
        {
          template: { code: 'term', title: {"en":"Term","ro":"Termen"}, notes: 'Template for glossary terms' },
          blocks: [
            {
              block: { code: 'definition', title: {"en":"Definition","ro":"Definiție"}, content_type: 'text', sort: null, notes: 'The definition of the term' },
            },
          ],
        },
      ],
      nodes: [
        {
          node: { code: 'dermatitis', templateCode: 'term', nodeTypeCode: 'term', title: {"en":"Dermatitis","ro":"Dermatită"}, slug: {"en":"dermatitis","ro":"dermatit"}, subtitle: {"en":"Inflammation of the skin","ro":"Inflamația pielii"}, notes: 'Inflammation of the skin', sort: 0 },
          contents: [
            { blockCode: 'definition', value: {"en":"Dermatitis is a general term for inflammation of the skin. It can have many causes, including allergies, irritants, or genetic factors. Common symptoms include redness, itching, and swelling. Types include atopic dermatitis (eczema), contact dermatitis, and seborrheic dermatitis.","ro":"Dermatita este un termen general pentru inflamația pielii. Poate avea multe cauze, inclusiv alergii, iritanți sau factori genetici. Simptomele comune includ roșeață, mâncărime și umflare. Tipurile includ dermatita atopică (eczema), dermatita de contact și dermatita seboreică."} },
          ],
        },
        {
          node: { code: 'melanoma', templateCode: 'term', nodeTypeCode: 'term', title: {"en":"Melanoma","ro":"Melanom"}, slug: {"en":"melanoma","ro":"melanom"}, subtitle: {"en":"A type of skin cancer that develops from melanocytes","ro":"Un tip de cancer de piele care se dezvoltă din melanocite"}, notes: 'A type of skin cancer that develops from melanocytes', sort: 1 },
          contents: [
            { blockCode: 'definition', value: {"en":"Melanoma is a serious form of skin cancer that develops in melanocytes, the cells that produce melanin (skin pigment). It often appears as a new spot or a change in an existing mole. Early detection is crucial for successful treatment. Risk factors include UV exposure, fair skin, and family history.","ro":"Melanomul este o formă gravă de cancer de piele care se dezvoltă în melanocite, celulele care produc melanină (pigmentul pielii). Apare adesea ca o pată nouă sau o modificare a unei alunițe existente. Detectarea timpurie este crucială pentru tratamentul de succes. Factorii de risc includ expunerea la UV, pielea deschisă la culoare și istoricul familial."} },
          ],
        },
        {
          node: { code: 'psoriasis', templateCode: 'term', nodeTypeCode: 'term', title: {"en":"Psoriasis","ro":"Psoriazis"}, slug: {"en":"psoriasis","ro":"psoriazis"}, subtitle: {"en":"A chronic autoimmune condition causing rapid skin cell buildup","ro":"O afecțiune autoimună cronică ce provoacă acumularea rapidă a celulelor pielii"}, notes: 'A chronic autoimmune condition causing rapid skin cell buildup', sort: 2 },
          contents: [
            { blockCode: 'definition', value: {"en":"Psoriasis is a chronic autoimmune condition that causes rapid buildup of skin cells, leading to scaling on the skin surface. The scales are whitish-silver and develop in thick, red patches that can be itchy and painful. It is not contagious and typically goes through cycles of flare-ups and remission.","ro":"Psoriazisul este o afecțiune autoimună cronică care provoacă acumularea rapidă a celulelor pielii, ducând la descuamări pe suprafața pielii. Scuamele sunt alb-argintii și se dezvoltă în pete groase, roșii, care pot fi pruriginoase și dureroase. Nu este contagios și trece de obicei prin cicluri de acutizări și remisiuni."} },
          ],
        },
      ],
    },
  ],
};

export default preset;
