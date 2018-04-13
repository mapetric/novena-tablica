let inputJSON, outputJSON = null;

const arr = $('input');

// mijenja mjesto dana i mjeseca

const formatDate = (date) => {
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
      const birthDate = new Date(formatDate(dateOfBirth));
      return today.getFullYear() - birthDate.getFullYear();
};

// za svaki element u inputJSON-u radi novi red u tablici

const fillTable = () => {
      inputJSON.registrations.forEach(function(element){
            $('#table').append(
                  `<tr title="Datum rođenja: ${element.date_of_birth}">
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
                  "date_of_birth": $('#dateOfBirth').val(),
                  "date_of_registration": $('#dateOfRegistration').val()
            });
            $('#table').append(
                  `<tr title="Datum rođenja: ${outputJSON.registrations[outputJSON.registrations.length - 1].date_of_birth}">
                        <td>${outputJSON.registrations[outputJSON.registrations.length - 1].name}</td>
                        <td>${outputJSON.registrations[outputJSON.registrations.length - 1].surname}</td>
                        <td>${outputJSON.registrations[outputJSON.registrations.length - 1].sex === "male" ? "M" : "F"}</td>
                        <td>${howOld(outputJSON.registrations[outputJSON.registrations.length - 1].date_of_birth)}</td>
                        <td>${outputJSON.registrations[outputJSON.registrations.length - 1].date_of_registration}</td>
                  </tr>`);

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

// ucita inputJSON sa lokalnog servera

$.getJSON('data.json').then(function(response) {
      inputJSON = response;
      outputJSON = $.extend(true, {}, inputJSON);
}, function(error) {
      console.error("Failed!", error);
}).then(function() {

// popunjava tablicu, dodaje event listenere za gumbe, i namjesta datepicker za datume

      fillTable();
      $('#addTableRow').click(addToTable);
      $('#sendJSON').click(sendToPastebin);
      $( "#dateOfBirth" ).datepicker({ dateFormat: 'dd.mm.yy.' });
      $( "#dateOfRegistration" ).datepicker({ dateFormat: 'dd.mm.yy.' });

      console.log("Loaded the JSON successfuly!");
}, function(error) {
      console.error("Failed!", error);
});
