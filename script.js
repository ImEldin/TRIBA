const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');

const radijusTacke = 14; // poluprecnik tacke koju crtamo
var razmakX = 60; // horizontalni razmak
var razmakY = 35; // vertikalni razmak 

//Korisitmo u crazy mode 
let brPoteza = 0;
let randPotez = randMove();

const tacke = []; // niz svi iscrtanih tacaka
const trouglovi = []; // niz svih trouglova trenutno na ploci
const aktivneTacke = []; // niz svih tacaka koje su vec iskoristene

//funkcija koja vraca random int 
function randMove(){

    let maxMoves = 10;
    let randomInt = Math.floor(Math.random() * (maxMoves + 1));
    if(randomInt === 0) randomInt = 1;

    return randomInt;
}

// funkcija koja pravi jednu od 5 mogucih ploca za igranje
function napraviPlocu(brRedova, brKolona){
    const prviIgra = Math.floor(Math.random() * 2); // Prvi igrac se bira nasumicno
    if(brRedova === 0 && brKolona === 0){
        // sve varijable saljemo u vidu URL-a
        window.location.href = 'board.html?brRedova=' + brRedova + '&brKolona=' + brKolona + '&prviIgra=' + prviIgra + '&unregularMode=' + 1;
    }
    else if(brRedova === 10 && brKolona === 14){
        brKolona -= 2;
        window.location.href = 'board.html?brRedova=' + brRedova + '&brKolona=' + brKolona + '&prviIgra=' + prviIgra + '&crazyMode=' + 1;
    }
    else{
        window.location.href = 'board.html?brRedova=' + brRedova + '&brKolona=' + brKolona + '&prviIgra=' + prviIgra;
    }
}

// kupimo sve varijable iz URL-a
const urlParams = new URLSearchParams(window.location.search);
const brRedova = parseInt(urlParams.get('brRedova')) || 0;
const brKolona = parseInt(urlParams.get('brKolona')) || 0;
var koStarta = parseInt(urlParams.get('prviIgra')) || 0;
var koIgra = parseInt(urlParams.get('prviIgra')) || 0;
let crazyMode = parseInt(urlParams.get('crazyMode')) || 0;
let unregularMode = parseInt(urlParams.get('unregularMode')) || 0;

// gledamo koji igrac igra prvi i na osnovu toga postavljamo odgovarajuce boje
if(koIgra === 0){
    canvas.style.boxShadow = '0px 0px 50px blue';
    const myDiv1 = document.getElementById('player1');
    myDiv1.style.color = 'blue';
    const myDiv2 = document.getElementById('player2');
    myDiv2.style.color = 'gray';
}
else{
    canvas.style.boxShadow = '0px 0px 50px yellow';
    const myDiv2 = document.getElementById('player2');
    myDiv2.style.color = 'yellow';
    const myDiv1 = document.getElementById('player1');
    myDiv1.style.color = 'gray';
}

// ako je bilo koji mode osim neregularnog pravi se ploca mxn
if(unregularMode === 0){
    
    const ukupnaSirina = brKolona * (2 * radijusTacke + razmakX) + razmakX;
    const ukupnaVisina = brRedova * (2 * radijusTacke + razmakY) + razmakY;
    const offsetX = (canvas.width - ukupnaSirina) / 2;
    const offsetY = (canvas.height - ukupnaVisina) / 2;
    
    for (let i = 0; i < brRedova; i++) {
        for (let j = 0; j < brKolona; j++) {
          const x = j * (2 * radijusTacke + razmakX) + radijusTacke + razmakX + offsetX;
          const y = i * (2 * radijusTacke + razmakY) + radijusTacke + razmakY + offsetY;
          tacke.push({ x, y, boja: "grey", aktivna: false});
          nacrtajTacku(x, y, "grey");
        }
    }
}
// u suprotnom pravimo trapez za neregularni mode
else{

    const sirinaTrapeza = 700; // sirina trapeza
    const duzinaTrapeza = 700; // visina trapeza
    const centarX = canvas.width / 2; // pronadjemo sredinu ekrana (x-kord)
    const centarY = canvas.height / 2; // pronadjemo sredinu ekrana (y-kord)

    const brRedova = 30; // broj redova u trapezu
    const brKolona = 30; // broj kolona u trapezu
    const radijusTacke = 5; // poluprecnik tacke
    const razmakX = 35; // horizontalni razmak
    const razmakY = 35; // vertikalni razmak

    const ukupnaSirina = brKolona * (2 * radijusTacke + razmakX) + razmakX;
    const ukupnaVisina = brRedova * (2 * radijusTacke + razmakY) + razmakY;
    const offsetX = (canvas.width - ukupnaSirina) / 2;
    const offsetY = (canvas.height - ukupnaVisina) / 2;

    for (let i = 0; i < brRedova; i++) {
        for (let j = 0; j < brKolona; j++) {
            const x = j * (2 * radijusTacke + razmakX) + radijusTacke + razmakX + offsetX;
            const y = i * (2 * radijusTacke + razmakY) + radijusTacke + razmakY + offsetY;

            const relX = x - centarX;
            const relY = y - centarY;

            // provjeravamo da li tacka pripada trapezu - chatGPT
            if (Math.abs(relX) + Math.abs(relY) <= sirinaTrapeza / 2) {
                tacke.push({ x, y, boja: "grey", aktivna: false });
                nacrtajTacku(x, y, "grey");
            }
        }
    }
}

// funkcija koja crta tacku na ekran
function nacrtajTacku(x, y, boja) {
    ctx.beginPath();
    ctx.arc(x, y, radijusTacke, 0, Math.PI * 2);
    ctx.fillStyle = boja;
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.stroke();
}

// funkcija koja mijenja boju tacke
function promjeniBojuTacke(tacka, boja) {
    tacka.boja = boja;
    nacrtajTacku(tacka.x, tacka.y, tacka.boja)
}

// funkcija za provjeru kolinearnosti
function jesuLiKolinearne(tacka1, tacka2, tacka3) {
    // racuna povrsinu tijela kojeg prave tri date tacke
    const povrsina = 0.5 * Math.abs(
        tacka1.x * (tacka2.y - tacka3.y) + tacka2.x * (tacka3.y - tacka1.y) + tacka3.x * (tacka1.y - tacka2.y)
    );
    return povrsina === 0; // ako je povrsina 0 tacke su kolinearne tj. imamo liniju
}
// funkcija koja racuna udaljenost tacke od prave(ne segmenta vec prave)
function udaljenostOdLinije(px, py, x1, y1, x2, y2) {
    const brojnik = Math.abs((y2 - y1) * px - (x2 - x1) * py + x2 * y1 - y2 * x1);
    const nazivnik = Math.sqrt((y2 - y1) ** 2 + (x2 - x1) ** 2);

    return brojnik / nazivnik; // Klasična udaljenost tacke od prave
}
// funckija koja provjerava da li tacka pripada segmentu
function daLiJeNaSegmentu(px, py, x1, y1, x2, y2) {
    // formula za racunanje projekcije tacke (px, py) na segmetn A(x1,y1),B(x2,y2)
    const proekcija = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / ((x2 - x1) ** 2 + (y2 - y1) ** 2);
    
    // Provjeri da li je proekcija unutar granica segmenta (0 <= proekcija <= 1)
    return proekcija >= 0 && proekcija <= 1;
}
// funkcija za crtanje trougla
function nacrtajTrougao(tacka1, tacka2, tacka3) {

    const threshold = radijusTacke + 1; // granica za udaljenost od linije

    for (const tacka of tacke) {
        // provjerava tu udaljenost za svaku stranicu trougla
        if (
            daLiJeNaSegmentu(tacka.x, tacka.y, tacka1.x, tacka1.y, tacka2.x, tacka2.y) && 
            udaljenostOdLinije(tacka.x, tacka.y, tacka1.x, tacka1.y, tacka2.x, tacka2.y) <= threshold ||
            daLiJeNaSegmentu(tacka.x, tacka.y, tacka2.x, tacka2.y, tacka3.x, tacka3.y) && 
            udaljenostOdLinije(tacka.x, tacka.y, tacka2.x, tacka2.y, tacka3.x, tacka3.y) <= threshold ||
            daLiJeNaSegmentu(tacka.x, tacka.y, tacka3.x, tacka3.y, tacka1.x, tacka1.y) && 
            udaljenostOdLinije(tacka.x, tacka.y, tacka3.x, tacka3.y, tacka1.x, tacka1.y) <= threshold
        ) {
            // Promenjujemo boje svih tačaka kroz koje prolazi stranica trougla
            tacka.boja = "rgb(139, 0, 0)"; 
            nacrtajTacku(tacka.x, tacka.y, "rgb(139, 0, 0)");
            // Oznacavamo takve tačke kao aktivne
            tacka.aktivna = true;
        }
    }
    // povezujemo tacke tj. crtamo trougao
    if (koIgra === 0) {
        ctx.beginPath();
        ctx.moveTo(tacka1.x, tacka1.y); // kreni od prve tacke
        ctx.lineTo(tacka2.x, tacka2.y); // spoji je sa drugom
        ctx.lineTo(tacka3.x, tacka3.y); // spoji drugu i trecu
        ctx.closePath(); // zatvori trougao
        ctx.lineWidth = 3; // debljina stranice
        ctx.strokeStyle = "blue"; // plava boja za prvog igraca
        ctx.stroke();
    } 
    else {
        ctx.beginPath();
        ctx.moveTo(tacka1.x, tacka1.y); // kreni od prve tacke
        ctx.lineTo(tacka2.x, tacka2.y); // spoji je sa drugom
        ctx.lineTo(tacka3.x, tacka3.y); // spoji drugu i trecu
        ctx.closePath(); // zatvori trougao
        ctx.lineWidth = 3; // debljina stranice
        ctx.strokeStyle = "yellow"; // zuta boja za drugog igraca
        ctx.stroke();
    }

}

// funkcija koja provjerava da li se prave sijeku
function daLiSeLinijeSijeku(p1, q1, p2, q2){

    // linija p1q1 tj prava napisana u obliku a1x + b1y = c1
    const a1 = q1.y - p1.y;
    const b1 = p1.x - q1.x;
    const c1 = a1 * p1.x + b1 * p1.y;

    // linija p2q2 tj prava napisana u obliku a2x + b2y = c2
    const a2 = q2.y - p2.y;
    const b2 = p2.x - q2.x;
    const c2 = a2 * p2.x + b2 * p2.y;

    const determinanta = a1 * b2 - a2 * b1;

    // ako su linije paralelne determinanta je 0 
    if (determinanta === 0) return false;

    // ako je determinanta razlicita od nule postoji tacno jedna presjecna tacka
    // presjecna tacka 
    const x = (b2 * c1 - b1 * c2) / determinanta;
    const y = (a1 * c2 - a2 * c1) / determinanta;

    // ako presjecna tacka lezi na obje prave one se sijeku
    if (
        x >= Math.min(p1.x, q1.x) && x <= Math.max(p1.x, q1.x) &&
        y >= Math.min(p1.y, q1.y) && y <= Math.max(p1.y, q1.y) &&
        x >= Math.min(p2.x, q2.x) && x <= Math.max(p2.x, q2.x) &&
        y >= Math.min(p2.y, q2.y) && y <= Math.max(p2.y, q2.y)
    ) {
        return true;
    }
    return false;
}

function provjeriSijekuLiSeTrouglovi(noviTrougao, trougao){

    //tacke novog trougla
    const nt1 = noviTrougao[0];
    const nt2 = noviTrougao[1];
    const nt3 = noviTrougao[2];

    //tacke trougla koji je vec nacrtan
    const t1 = trougao[0];
    const t2 = trougao[1];
    const t3 = trougao[2];

    //pozovemo funkciju za svaku kombinaciju pravih u trouglu
    if( daLiSeLinijeSijeku(nt1, nt2, t1, t2) ||
        daLiSeLinijeSijeku(nt1, nt2, t1, t3) ||
        daLiSeLinijeSijeku(nt1, nt2, t2, t3) || 
        daLiSeLinijeSijeku(nt1, nt3, t1, t2) ||
        daLiSeLinijeSijeku(nt1, nt3, t1, t3) || 
        daLiSeLinijeSijeku(nt1, nt3, t2, t3) || 
        daLiSeLinijeSijeku(nt2, nt3, t1, t2) || 
        daLiSeLinijeSijeku(nt2, nt3, t1, t3) || 
        daLiSeLinijeSijeku(nt2, nt3, t2, t3)
    ){
        return true;
    }
    
    return false;
}

// funkcija za provjeru kraja igre
function jeLiKraj(){
    for(let i=0; i<tacke.length; i++){
        for(let j=0; j<tacke.length; j++){
            for(let k=0; k<tacke.length; k++){

                let valid = true;

                const tacka1 = tacke[i];
                const tacka2 = tacke[j];
                const tacka3 = tacke[k];

                if (tacka1.aktivna || tacka2.aktivna || tacka3.aktivna) continue; // ako je bilo koja od tri tacke aktivna idi dalje

                if (jesuLiKolinearne(tacka1, tacka2, tacka3)) continue; // ako su kolinearne idi dalje

                const noviTrougao = [tacka1, tacka2, tacka3]; // napravi novi trougao

                const threshold = radijusTacke + 1; // granica za udajenost tacke od stranice trougla

                for (const tacka of tacke) {
                    // provjeravamo svaku tacku 
                    if (
                        daLiJeNaSegmentu(tacka.x, tacka.y, tacka1.x, tacka1.y, tacka2.x, tacka2.y) && 
                        udaljenostOdLinije(tacka.x, tacka.y, tacka1.x, tacka1.y, tacka2.x, tacka2.y) <= threshold ||
                        daLiJeNaSegmentu(tacka.x, tacka.y, tacka2.x, tacka2.y, tacka3.x, tacka3.y) && 
                        udaljenostOdLinije(tacka.x, tacka.y, tacka2.x, tacka2.y, tacka3.x, tacka3.y) <= threshold ||
                        daLiJeNaSegmentu(tacka.x, tacka.y, tacka3.x, tacka3.y, tacka1.x, tacka1.y) && 
                        udaljenostOdLinije(tacka.x, tacka.y, tacka3.x, tacka3.y, tacka1.x, tacka1.y) <= threshold
                    ) {
                        // ako je neka od tacki preko koje prelazi stranica trougla aktivna to nije validan trougao 
                        if(tacka.aktivna === true){
                            valid = false;
                            break;
                        }
                    }
                }
                
                // ako je trougao validan provjeri sijece li se sa vec postojecim trouglovima
                for (const trougao of trouglovi) {
                    if (provjeriSijekuLiSeTrouglovi(noviTrougao, trougao) && valid === true) {
                        valid = false;
                        break;
                    }
                }

                // ako je proslo sve provjere postoji validan potez i nije kraj
                if (valid) {
                    return false;
                }
            }
        }
    }
    return true;
}

canvas.addEventListener('click', (event) => {

    const rect = canvas.getBoundingClientRect(); // vraca velicinu i poziciju ploce
    const clickX = event.clientX - rect.left; // namjestamo da klik bude relativan u odnosu na plocu a ne na citav ekran
    const clickY = event.clientY - rect.top; // namjestamo da klik bude relativan u odnosu na plocu a ne na citav ekran
    
    for (const tacka of tacke) {
      const udaljenost = Math.sqrt((clickX - tacka.x) ** 2 + (clickY - tacka.y) ** 2);
      // ako smo kliknuli na tacku
      if (udaljenost <= radijusTacke + 1) {
        // ako je tacka aktivna
        if(tacka.aktivna === true){

            alert("Ne mozete koristiti iskoristenu tacku! Potez ide drugom igracu...");
            if (koIgra === 0) {
                koIgra = 1; // prelazimo na igraca 2
                canvas.style.boxShadow = '0px 0px 50px yellow';
                const myDiv2 = document.getElementById('player2');
                myDiv2.style.color = 'yellow';
                const myDiv1 = document.getElementById('player1');
                myDiv1.style.color = 'gray';
            } 
            else {
                koIgra = 0; // prelazimo na igraca 1
                canvas.style.boxShadow = '0px 0px 50px blue'; // Highlight Player 1
                const myDiv1 = document.getElementById('player1');
                myDiv1.style.color = 'blue';
                const myDiv2 = document.getElementById('player2');
                myDiv2.style.color = 'gray';
            }
            for(const tacka of aktivneTacke){
                promjeniBojuTacke(tacka, "gray");
                tacka.aktivna = false;
            }
            aktivneTacke.length = 0;
            break;
        }
        // dodajemo tacku u niz selektovanih tacaka
        else{
            promjeniBojuTacke(tacka, "red");
            aktivneTacke.push(tacka);
            tacka.aktivna = true;
        }
        // ako smo kliknuli tri tacke
        if (aktivneTacke.length === 3) {
            // provjeravamo jesu li kolinearne
            if (!jesuLiKolinearne(aktivneTacke[0], aktivneTacke[1], aktivneTacke[2])) {
                //ako je ovo prvi trougao samo ga dodaj
                if(trouglovi.length === 0){
                    nacrtajTrougao(aktivneTacke[0], aktivneTacke[1], aktivneTacke[2]); // crtanje trougla
                    const noviTrougao = [aktivneTacke[0], aktivneTacke[1], aktivneTacke[2]];
                    trouglovi.push(noviTrougao);
                    brPoteza++; // povecaj broj odigranih poteza - ovo je za crazy mode
                }
                // ako imamo vise trouglova moramo provjeriti da li se sijeku
                else{
                    const noviTrougao = [aktivneTacke[0], aktivneTacke[1], aktivneTacke[2]];
                    let sijeku = false;
                    for(const trougao of trouglovi){
                        if(provjeriSijekuLiSeTrouglovi(noviTrougao, trougao)){
                            sijeku = true;
                        }
                    }
                    // ako se ne sijeku dodaj i provjeri je li kraj igre
                    if(!sijeku){
                        const threshold = radijusTacke + 1; // granica za udaljenost od linije
                        const tacka1 = aktivneTacke[0];
                        const tacka2 = aktivneTacke[1];
                        const tacka3 = aktivneTacke[2];
                        let valid = true; // na pocetku je trougao validan

                        for (const tacka of tacke) {
                            // provjerava udaljenost tacke od svake stranice trougla
                            if (
                                daLiJeNaSegmentu(tacka.x, tacka.y, tacka1.x, tacka1.y, tacka2.x, tacka2.y) && 
                                udaljenostOdLinije(tacka.x, tacka.y, tacka1.x, tacka1.y, tacka2.x, tacka2.y) <= threshold ||
                                daLiJeNaSegmentu(tacka.x, tacka.y, tacka2.x, tacka2.y, tacka3.x, tacka3.y) && 
                                udaljenostOdLinije(tacka.x, tacka.y, tacka2.x, tacka2.y, tacka3.x, tacka3.y) <= threshold ||
                                daLiJeNaSegmentu(tacka.x, tacka.y, tacka3.x, tacka3.y, tacka1.x, tacka1.y) && 
                                udaljenostOdLinije(tacka.x, tacka.y, tacka3.x, tacka3.y, tacka1.x, tacka1.y) <= threshold
                            ) {
                                // ako je tacka aktivna i nije jedna od tri vrha, taj trougao nije validan jer mu stranica prelazi preko iskoristene tacke
                                // dodatni uslov je da nije crna - ove tacke se javljaju samo u crazy mode
                                if(tacka.aktivna === true && tacka != tacka1 && tacka != tacka2 && tacka != tacka3 && tacka.boja != "black"){
                                    valid = false;
                                    break;
                                }
                            }
                        }
                        // ako je trougao validan samo ga iscrtaj i dodaj u listu
                        if(valid){
                            nacrtajTrougao(aktivneTacke[0], aktivneTacke[1], aktivneTacke[2]);
                            trouglovi.push(noviTrougao);
                        }
                        // ako nije ocisti tacke koje su koristene
                        else{
                            for(const tacka of aktivneTacke){
                                promjeniBojuTacke(tacka, "gray");
                                tacka.aktivna = false;
                            }
                            alert("Stranica trougla prelazi preko vec iskoristene tacke! Potez ide drugom igracu...");

                        }
                        if(jeLiKraj()){
                            //igrac koji je startao drugi u novoj igri igra prvi
                            if(koStarta === 0){
                                koStarta = 1;
                            }
                            else{
                                koStarta = 0;
                            }
                            // dodjela boje igracu
                            let igrac;
                            if(koIgra === 0){
                                igrac = 'plavi';
                            }
                            else{
                                igrac = 'zuti';
                            }
                            //ispis koji je igrac pobijedio i prelazak na novu igru ili nazad na main meni
                            const novaIgra = confirm(`Pobijedio je ${igrac} igrač! Nova igra?`);
                            if(novaIgra && crazyMode === 0 && unregularMode === 0) window.location.href = 'board.html?brRedova=' + brRedova + '&brKolona=' + brKolona + '&prviIgra=' + koStarta;
                            else if(novaIgra && crazyMode === 1) window.location.href = 'board.html?brRedova=' + brRedova + '&brKolona=' + brKolona + '&prviIgra=' + koStarta + '&crazyMode=' + 1;
                            else if(novaIgra && unregularMode === 1) window.location.href = 'board.html?brRedova=' + brRedova + '&brKolona=' + brKolona + '&prviIgra=' + koStarta + '&unregularMode=' + 1;
                            else window.location.href = 'main.html';
                        }
                        brPoteza ++;
                    }
                    // ako se trouglovi sijeku vrati boju selektovanih tacaka i stavi ih kao neaktivne
                    else{
                        for(const tacka of aktivneTacke){
                            promjeniBojuTacke(tacka, "gray");
                            tacka.aktivna = false;
                        }
                        alert("Trouglovi se sijeku! Potez ide drugom igracu...");
                    }
                }

                // crazy mode
                if(brPoteza === randPotez && crazyMode === 1){
                    let randomInt = Math.floor(Math.random() * 7) + 1;
                    for(let n=0; n<randomInt; n++){
                        let max = tacke.length;
                        let randomNum = Math.floor(Math.random() * (max + 1));
                        while(tacke[randomNum].aktivna === true){
                            randomNum = Math.floor(Math.random() * (max + 1));
                        }

                        let randtacka = tacke[randomNum];
                        promjeniBojuTacke(randtacka, "black");
                        randtacka.aktivna = true;
                    }
                    randPotez = randMove();
                    brPoteza = 0;
                }
            }
            // ako jesu vrati boju selektovanih tacaka na sivu i stavi da nisu selektovane
            else{
                for(const tacka of aktivneTacke){
                    promjeniBojuTacke(tacka, "gray");
                    tacka.aktivna = false;
                }
                alert("Ne mozete napraviti liniju! Potez ide drugom igracu...");
            }
            aktivneTacke.length = 0; // ocisti niz aktivnih tacaka

            // ako je sve proslo promjeni igraca
            if (koIgra === 0) {
                koIgra = 1; // prelazimo na igraca 2
                canvas.style.boxShadow = '0px 0px 50px yellow'; // Highlight Player 2
                const myDiv2 = document.getElementById('player2');
                myDiv2.style.color = 'yellow';
                const myDiv1 = document.getElementById('player1');
                myDiv1.style.color = 'gray';
                
            } else {
                koIgra = 0; // prelazimo na igraca 1
                canvas.style.boxShadow = '0px 0px 50px blue'; // Highlight Player 1
                const myDiv1 = document.getElementById('player1');
                myDiv1.style.color = 'blue';
                const myDiv2 = document.getElementById('player2');
                myDiv2.style.color = 'gray';
            }
        }
        break;
      }
    }
  });