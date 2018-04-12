let inputJSON, outputJSON = null;

// poruke za popup poredane kako se pojavljuju stupci

const popupMessages = ['ime kandidata', 'prezime kandidata', 'spol kandidata', 'dob kandidata', 'datum prijave kandidata'];

// aray sa svim input poljima

const arr = $('input');

// za pomak popup-a da izbjegnemo vizualno titranje

const moveLeft = 20;
const moveDown = 10;

// mijenja format datuma i trimira 0 ako se nalazi na prvom mjestu kod dana i mjeseca

const modifyDate = (date) => {
      let date1 = date.split('-');
      date1[1] = date1[1][0] === '0' ? date1[1][1] : date1[1];
      date1[2] = date1[2][0] === '0' ? date1[2][1] : date1[2];
      return `${date1.reverse().join('.')}.`;
};

// mijenja mjesto dana i mjeseca

const changeDateFormat = (date) => {
      let date1 = date.split('.');
      let date2 = [];
      date2.push(date1[1]);
      date2.push(date1[0]);
      date2.push(date1[2]);
      date2.push(date1[3]);
      date2 = date2.join('.');
      return date2;
};

// racuna koliko je osoba stara u godinama

const howOld = (dateOfBirth) => {
      const today = new Date();
      const birthDate = new Date(changeDateFormat(dateOfBirth));
      return today.getFullYear() - birthDate.getFullYear();
};

// za svaki element u inputJSON-u radi novi red u tablici

const fillTable = () => {
      inputJSON.registrations.forEach(function(element){
            $('#table').append(
                  `<tr>
                        <td>${element.name}</td>
                        <td>${element.surname}</td>
                        <td>${element.sex === "male" ? "M" : "F"}</td>
                        <td>${howOld(element.date_of_birth)}</td>
                        <td>${element.date_of_registration}</td>
                  </tr>`);
      });
};

// dodaje nove podatke u outputJSON i red u tablicu nakon sto provjeri da su sva polja popunjena ako nisu oznaci ih

const addToTable = () => {
      if($('#name').val() !== '' && $('#surname').val() !== '' && $('#dateOfBirth').val() !== '' &&  $('#dateOfRegistration').val() !== '') {
            removeMissing();
            outputJSON.registrations.push(
                  {"name": $('#name').val(),
                  "surname": $('#surname').val(),
                  "sex": $('#gender').val(),
                  "date_of_birth": modifyDate($('#dateOfBirth').val()),
                  "date_of_registration": modifyDate($('#dateOfRegistration').val())});
            $('#table').append(
                  `<tr>
                        <td>${$('#name').val()}</td>
                        <td>${$('#surname').val()}</td>
                        <td>${$('#gender').val() === "male" ? "M" : "F"}</td>
                        <td>${howOld($('#dateOfBirth').val())}</td>
                        <td>${modifyDate($('#dateOfRegistration').val())}</td>
                  </tr>`);

// event listener koji pokazuje datum rodena kad smo na redu i skriva ga kad uklonimo mis sa reda

            $('tr').last().mouseenter(displayDateOfBirth).mouseleave(hideDateOfBirth);
      } else {
            handleMissing();
      }
};

// dodaje i uklanja missing class ovisno o vrijednosti input polja

const handleMissing = () => {
      for (let i = 0; i < arr.length; i++) {
            if ($(arr[i]).val() === '') {
                  $(arr[i]).addClass('missing');
            } else {
                  $(arr[i]).removeClass('missing');
            }
      }
}

// uklanja missing class sa svih input polja

const removeMissing = () => {
      for (let i = 0; i < arr.length; i++) {
            $(arr[i]).removeClass('missing');
      }
}


const sendToPastebin = () => {

      // napravi nekaj sa outputJSON

};

// nije fat arrow funkcija jer one bindaju this na window object, dodaje td sa datumom rodenja odredenog reda

function displayDateOfBirth() {
      $(`#table tr:nth-child(${$(this).index() + 1})`).append(`<td>Datum rođenja: ${outputJSON.registrations[$(this).index()-1].date_of_birth}</td>`);
}

// nije fat arrow funkcija jer one bindaju this na window object, uklanja td sa datumom rodenja odredenog reda

function hideDateOfBirth() {
      $(`#table tr:nth-child(${$(this).index() + 1})`).children().last().remove();
}

// ucita inputJSON sa lokalnog servera

$.getJSON('data.json').then(function(response) {
      inputJSON = response;
      outputJSON = $.extend(true, {}, inputJSON);
}, function(error) {
      console.error("Failed!", error);
}).then(function() {

// popunjava tablicu, dodaje event listenere za gumbe, redke (ako nisu header) za prikaz datuma rodenja, popup za header red

      fillTable();
      $('#addTableRow').click(addToTable);
      $('#sendJSON').click(sendToPastebin);
      $('tr').not($('#header')).mouseenter(displayDateOfBirth).mouseleave(hideDateOfBirth);
      $('#header td').hover(function(e) {

// mijenja sadrzaj popup-a ovisno o indexu td u kojem smo (uzima poruku iz popupMessages arraya)

            $('.pop-up').text(`${popupMessages[$(this).index()]}`).show();
      }, function() {
            $('.pop-up').hide();
      });

// mice div sa popup-om kada se krecemo po header redu

      $('#header').mousemove(function(e) {
            $(".pop-up").css('top', e.pageY + moveDown).css('left', e.pageX + moveLeft);
      });
      console.log("Loaded the JSON successfuly!");
}, function(error) {
      console.error("Failed!", error);
});
