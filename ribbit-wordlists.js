// ribbit-wordlists.js — CEFR Vocabulary Sets for Level-Aware Highlighting
// Based on Oxford 3000/5000 and Cambridge English vocabulary lists
// Each set contains words LEARNED AT that level (not cumulative)
// Source: https://www.oxfordlearnersdictionaries.com/about/wordlists/oxford3000-5000

// ── A2 WORDS ─────────────────────────────────────────────────────────────────
// Words a student learns at A2 (Elementary). Challenging for Pre-A1 / A1 learners.

const WORDS_A2 = new Set([
  // Verbs
  'accept','achieve','add','advise','afford','agree','allow','announce','appear',
  'apply','arrange','arrive','avoid','belong','borrow','carry','catch','celebrate',
  'change','check','choose','clean','climb','collect','compare','complete','connect',
  'contain','cook','copy','count','cut','decide','deliver','describe','discover',
  'draw','dream','earn','enjoy','enter','escape','exist','explain','fall','feed',
  'fight','fill','finish','fix','forget','grow','guess','hide','hit','improve',
  'include','invite','join','jump','knock','laugh','lift','lose','manage','measure',
  'mention','miss','mix','offer','own','pass','pick','plan','plant','point',
  'prepare','pull','push','reach','receive','relax','remember','remove','repair',
  'repeat','reply','return','ride','rise','save','send','share','sign','sleep',
  'spend','start','stay','study','support','swim','teach','throw','travel','type',
  'visit','wait','worry',
  // Nouns
  'accident','activity','address','advice','afternoon','age','amount','area',
  'art','attention','bank','beach','boat','body','bottle','brother','building',
  'business','card','centre','city','clothes','cloud','colour','company',
  'conversation','country','culture','cup','date','daughter','direction',
  'dream','drink','earth','education','email','energy','event','evening','example',
  'experience','factory','farm','festival','film','fire','floor','flower','forest',
  'future','garden','gift','glass','goal','government','group','heart',
  'history','hospital','hotel','husband','idea','information','island',
  'journey','key','king','kitchen','knife','knowledge','lake','language','letter',
  'library','list','map','market','meal','meeting','message','museum',
  'nature','neighbour','news','object','office','opinion','order','park',
  'party','phone','picture','place','plan','police','price','problem',
  'question','radio','reason','result','road','school','season','sentence','shape',
  'shop','sister','size','skill','sky','smile','song','sport','street','subject',
  'temperature','town','train','tree','trip','university','village','weather',
  'window','world',
  // Adjectives
  'angry','beautiful','boring','bright','busy','careful','cheap','clever',
  'comfortable','cool','correct','dangerous','delicious','dirty','empty','exciting',
  'expensive','famous','favourite','fresh','friendly','funny','healthy','helpful',
  'horrible','hungry','interesting','kind','lost','lucky','modern','narrow',
  'nervous','noisy','perfect','popular','possible','powerful','quiet','ready',
  'sad','safe','serious','shy','sick','similar','simple','smart','special',
  'strange','surprised','sweet','tired','warm','wide','wonderful','worried',
  // Adverbs and connectors
  'actually','already','although','anyway','carefully','clearly','easily',
  'finally','maybe','nearly','normally','often','perhaps','probably','quickly',
  'recently','slowly','soon','still','suddenly','usually','yet',
]);

// ── B1 WORDS ─────────────────────────────────────────────────────────────────
// Words a student learns at B1 (Intermediate). Challenging for Pre-A1–A2 learners.

const WORDS_B1 = new Set([
  // Verbs
  'achieve','adapt','admit','affect','afford','apologize','appreciate','argue',
  'assume','attack','behave','blame','cause','claim','compete','complain',
  'concentrate','convince','cope','damage','deal','define','depend','design',
  'develop','disagree','discuss','divide','doubt','encourage','establish',
  'evaluate','examine','fail','fear','focus','fund','gain','harm','identify',
  'imagine','increase','influence','inform','introduce','investigate','involve',
  'perform','prevent','produce','protect','prove','provide','publish','realise',
  'recognize','reduce','refuse','release','rely','research','respond','separate',
  'solve','succeed','suggest','survive','treat','trust','vote','waste',
  // Nouns
  'advantage','ambition','approach','argument','attitude','benefit','campaign',
  'career','cause','challenge','choice','circumstance','citizen','community',
  'comparison','competition','complaint','concept','confidence','conflict',
  'connection','consequence','context','contrast','contribution','debate',
  'decision','definition','demand','description','development','difference',
  'difficulty','disadvantage','discovery','discussion','economy','election',
  'emotion','environment','evidence','experiment','explanation','factor',
  'failure','freedom','generation','growth','happiness','harm','health',
  'impact','improvement','independence','influence','injury','intelligence',
  'intention','issue','justice','leadership','limit','loss','majority',
  'memory','method','minority','motive','mystery','network','opportunity',
  'performance','policy','population','poverty','preference','pressure',
  'principle','priority','process','progress','proof','proposal','punishment',
  'purpose','quality','reaction','reality','relationship','religion','reputation',
  'research','responsibility','risk','sacrifice','safety','situation','solution',
  'source','strength','structure','success','suggestion','survey','system',
  'technology','threat','tradition','truth','understanding','unemployment',
  'value','variety','victim','wealth','welfare',
  // Adjectives
  'academic','active','adequate','ambitious','ancient','appropriate','aware',
  'complex','confident','conscious','consistent','creative','critical','cultural',
  'current','democratic','dependent','depressed','detailed','determined','diverse',
  'domestic','dramatic','effective','efficient','emotional','environmental',
  'equal','essential','ethical','evident','extreme','flexible','formal','genuine',
  'global','grateful','guilty','harmful','historical','honest','ideal','illegal',
  'immediate','impressive','independent','individual','informal','initial',
  'innocent','intellectual','intense','international','logical','loyal','mental',
  'negative','obvious','official','ordinary','original','passionate','patient',
  'permanent','physical','political','positive','practical','precise',
  'professional','progressive','psychological','reasonable','relevant','reliable',
  'remarkable','remote','responsible','sensitive','significant','sophisticated',
  'successful','sufficient','suitable','thorough','traditional','typical',
  'unexpected','universal','unnecessary','unusual','violent','vital','voluntary',
  // Adverbs and connectors
  'absolutely','apparently','approximately','basically','certainly','consequently',
  'definitely','despite','equally','especially','eventually','furthermore',
  'generally','gradually','heavily','highly','however','increasingly','indeed',
  'mainly','meanwhile','moreover','mostly','nevertheless','obviously','overall',
  'particularly','personally','precisely','previously','primarily',
  'relatively','seriously','significantly','therefore','totally','whereas',
  'widely','unfortunately',
]);

// ── B2 WORDS ─────────────────────────────────────────────────────────────────
// Words a student learns at B2 (Upper-Intermediate). Challenging for Pre-A1–B1.

const WORDS_B2 = new Set([
  // Verbs
  'abandon','absorb','accommodate','accumulate','acknowledge','acquire','adapt',
  'adhere','advocate','allocate','alter','analyze','anticipate','assess',
  'attribute','broaden','characterize','collaborate','commence','compensate',
  'compile','comply','conceive','conduct','constitute','consult','convert',
  'correspond','decline','dedicate','demonstrate','derive','detect','diminish',
  'discriminate','distribute','dominate','eliminate','emerge','employ','enhance',
  'ensure','evolve','exclude','execute','facilitate','formulate','generate',
  'highlight','implement','impose','incorporate','indicate','initiate','integrate',
  'interpret','justify','maintain','manipulate','maximize','minimize','modify',
  'neglect','negotiate','obtain','oppose','overcome','perceive','persist',
  'portray','predict','prioritize','proceed','prohibit','promote','pursue',
  'reinforce','replace','restore','reveal','review','revise','simulate',
  'specify','stimulate','sustain','transform','transmit','undermine','utilize',
  'verify',
  // Nouns
  'abandonment','accuracy','acquisition','administration','agenda','allocation',
  'ambiguity','amendment','analogy','analysis','assumption','authority','bias',
  'capacity','category','clarity','collaboration','commitment','complexity',
  'component','compromise','consistency','consultation','controversy','convention',
  'correlation','criterion','delegation','dimension','discretion','distinction',
  'diversity','domain','duration','efficiency','enforcement','exclusion',
  'expertise','foundation','framework','hierarchy','hypothesis','ideology',
  'implementation','implication','incentive','indication','infrastructure',
  'innovation','interpretation','intervention','investigation','mechanism',
  'objective','obligation','obstacle','parameter','perspective','phenomenon',
  'precaution','precedent','preservation','procedure','productivity','proportion',
  'provision','rationale','regulation','rhetoric','scenario','scope',
  'specification','stability','strategy','substitute','tension','tolerance',
  'transparency','uncertainty','validity','variation',
  // Adjectives
  'abstract','acute','adjacent','adverse','affluent','aggregate','ambiguous',
  'analogous','arbitrary','autonomous','beneficial','categorical','coherent',
  'collaborative','compelling','comprehensive','conceptual','concurrent',
  'conducive','contradictory','controversial','cumulative','deliberate',
  'derivative','disproportionate','empirical','exclusive','explicit','fundamental',
  'hypothetical','identical','implicit','inconsistent','inevitable','influential',
  'inherent','innovative','integral','intensive','intrinsic','irrelevant',
  'justifiable','marginal','mutual','neutral','normative','objective','parallel',
  'partial','passive','peripheral','preliminary','prevalent','rational','rigid',
  'robust','simultaneous','statistical','subjective','substantial','symbolic',
  'systematic','theoretical','trivial','uniform','valid','variable','vulnerable',
  // Adverbs
  'accordingly','adversely','collectively','consistently','critically',
  'explicitly','extensively','implicitly','inherently','intensively',
  'objectively','predominantly','proportionally','simultaneously',
  'substantially','systematically','theoretically','uniformly',
]);

// ── C1 WORDS ─────────────────────────────────────────────────────────────────
// Words a student learns at C1 (Advanced). Challenging for all levels below C1.

const WORDS_C1 = new Set([
  // Verbs — sophisticated/academic
  'abstain','alleviate','amalgamate','arbitrate','articulate','circumvent',
  'coerce','conjecture','consolidate','contend','corroborate','deliberate',
  'delineate','disseminate','elucidate','emulate','encapsulate','endorse',
  'envisage','epitomize','exemplify','expedite','extrapolate','fabricate',
  'fortify','galvanize','hypothesize','illuminate','impede','infer','instigate',
  'juxtapose','mitigate','orchestrate','precipitate','proliferate','reconcile',
  'rectify','relinquish','repudiate','scrutinize','speculate','substantiate',
  'transcend','vindicate',
  // Nouns — sophisticated/academic
  'abstraction','acrimony','affinity','allegiance','ambivalence','animosity',
  'anomaly','antagonism','assertion','autonomy','axiom','benevolence','catharsis',
  'coherence','complacency','conciliation','condemnation','conjecture','contention',
  'credibility','cynicism','deficiency','deliberation','discrepancy','disparity',
  'dissent','eloquence','empiricism','enigma','equanimity','eradication','fallacy',
  'frugality','futility','hubris','idealism','impunity','incongruity','indignation',
  'inference','ingenuity','integrity','juxtaposition','magnanimity','manifesto',
  'meritocracy','metaphor','nuance','objectivity','paradox','polarization',
  'pragmatism','predisposition','presumption','profundity','rationalism',
  'reciprocity','redundancy','resilience','reticence','scrutiny','skepticism',
  'solidarity','sovereignty','speculation','stigma','subtlety','synthesis',
  'trajectory','ubiquity','vulnerability','zeal',
  // Adjectives — sophisticated
  'aberrant','abstruse','anachronistic','astute','austere','cogent','convoluted',
  'cynical','dogmatic','elusive','eminent','erudite','esoteric','exacerbated',
  'fervent','formidable','idiosyncratic','inconclusive','indispensable',
  'inexplicable','inextricable','insidious','lucid','meticulous','nuanced',
  'obtrusive','paradoxical','pervasive','plausible','pragmatic','precarious',
  'profound','prolific','provisional','resilient','reticent','rigorous',
  'seminal','speculative','tangential','tenacious','ubiquitous','unprecedented',
  'unequivocal','zealous',
]);

// ── HIGHLIGHT LOGIC ───────────────────────────────────────────────────────────

// Map from app level (1-6) to which word sets to check
// App levels: 1=Pre-A1, 2=A1, 3=A2, 4=B1, 5=B2, 6=C1
const LEVEL_CHALLENGE_SETS = {
  1: [['a2', WORDS_A2], ['b1', WORDS_B1], ['b2', WORDS_B2], ['c1', WORDS_C1]],
  2: [['a2', WORDS_A2], ['b1', WORDS_B1], ['b2', WORDS_B2], ['c1', WORDS_C1]],
  3: [['b1', WORDS_B1], ['b2', WORDS_B2], ['c1', WORDS_C1]],
  4: [['b2', WORDS_B2], ['c1', WORDS_C1]],
  5: [['c1', WORDS_C1]],
  6: [],
};

// Returns the CEFR level string if a word is above the student's level, else null
function getChallengeLevel(word, appLevel) {
  const sets = LEVEL_CHALLENGE_SETS[appLevel] || [];
  for (const [levelName, set] of sets) {
    if (set.has(word)) return levelName;
  }
  return null;
}

// Human-readable level labels
const CEFR_LABELS = { a2: 'A2', b1: 'B1', b2: 'B2', c1: 'C1' };
