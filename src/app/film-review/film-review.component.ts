import { Component, OnInit, ViewChild } from '@angular/core';
import { FilmReview } from 'models/FilmReview';

@Component({
  selector: 'app-film-review',
  templateUrl: './film-review.component.html',
  styleUrls: ['./film-review.component.scss']
})
export class FilmReviewComponent implements OnInit {

  // local storage was implemented last
  // which made some code redundant
  // kept it for the option to switch to memory storage
  invalidFilm: boolean = false;
  selected? :string;
  div1: boolean = false;
  div2: boolean = false;
  div3: boolean = false;
  filmReview!: FilmReview[];
  tempFilmReview!: FilmReview[];
  localStorageFilmReview: any;
  data: any;

  constructor() { }

  ngOnInit(): void {
    //On page load take the information from the local storage to be used by the variables & table.
    let data: any = localStorage.getItem('session');
    this.localStorageFilmReview = JSON.parse(data);
    this.filmReview = this.localStorageFilmReview;
    this.tempFilmReview = this.filmReview;
  }
  

  // Was used before local storage was implemented
  // filmReview: FilmReview[] = [
  //   {
  //     title: "Pirates of the Caribbean: The Curse of the Black Pearl",
  //     director: "Gore Verbinski",
  //     mainActor: "Johnny Depp",
  //     description: "Prepare to be blown out of the water",
  //     summary: "Blacksmith Will Turner teams up with eccentric pirate Captain Jack Sparrow to save his love, the governor's daughter, from Jack's former pirate allies, who are now undead.",
  //     rating: "4/5"
  //   },
  //   {
  //     title: "Inception",
  //     director: "Christopher Nolan",
  //     mainActor: "Leonardo DiCaprio",
  //     description: "The dream is real.",
  //     summary: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.",
  //     rating: "5/5"
  //   },
  //   {
  //     title: "Interstellar",
  //     director: "Christopher Nolan",
  //     mainActor: "Matthew McConaughey",
  //     description: "Mankind was born on Earth. It was never meant to die here.",
  //     summary: "Earth's future has been riddled by disasters, famines, and droughts. There is only one way to ensure mankind's survival: Interstellar travel. A newly discovered wormhole in the far reaches of our solar system allows a team of astronauts to go where no man has gone before, a planet that may have the right environment to sustain human life.",
  //     rating: "4/5"
  //   },
  //   {
  //     title: "Gladiator",
  //     director: "Ridley Scott",
  //     mainActor: "Russell Crowe",
  //     description: "A Hero Will Rise.",
  //     summary: "A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.",
  //     rating: "4/5"
  //   }
  // ]
  // tempFilmReview = this.filmReview;

  displayedColumns = ["title", "director", "mainActor", "description", "summary", "rating"];

  addFilm(title: string, director: string, mainActor: string, description: string, summary: string, rating: string) {
    for (const movie of this.filmReview) {
      if (movie.title == title) {
        this.invalidFilm = true;
        return;
      }
    }
    this.filmReview = this.tempFilmReview;
    this.filmReview = [...this.filmReview, { title, director, mainActor, description, summary, rating }];
    this.tempFilmReview = this.filmReview;
    this.selected = "All";
    this.hideAllDivs();
    this.saveToLocalStorage()
    this.invalidFilm = false;
  }

  updateFilm(title: string, director: string, mainActor: string, description: string, summary: string, rating: string) {
    for (const movie of this.filmReview) {
      if (movie.title == title) {
        this.filmReview = this.tempFilmReview;
        movie.title = title;
        movie.director = director;
        movie.mainActor = mainActor;
        movie.description = description;
        movie.summary = summary;
        movie.rating = rating;
        this.tempFilmReview = this.filmReview;
        this.selected = "All";
        this.hideAllDivs();
        this.saveToLocalStorage()
        break;
      }
    };
  }

  removeFilm(title: string) {
    this.filmReview = this.tempFilmReview;
    this.filmReview = this.filmReview.filter(item => item.title != title);
    this.tempFilmReview = this.filmReview;
    this.hideAllDivs();
    this.selected = "All";
    console.log('1');
    this.saveToLocalStorage();
  }


  ratings: any = [
    { value: 'All', viewValue: 'All' },
    { value: '1/5', viewValue: '1/5' },
    { value: '2/5', viewValue: '2/5' },
    { value: '3/5', viewValue: '3/5' },
    { value: '4/5', viewValue: '4/5' },
    { value: '5/5', viewValue: '5/5' },
  ];


  // created a temp array just for this sorting function
  // that now needs to be updated in all functions
  // Probably bad / inefficient
  sortFilm(rating: string) {
    this.filmReview = this.tempFilmReview
    this.localStorageFilmReview = this.filmReview;
    if (rating == 'All') {
      return;
    }
    this.filmReview = this.filmReview.filter(item => item.rating == rating);
    this.localStorageFilmReview = this.filmReview;
  }


  //This is probably not the best way to do this
  showForm(formDiv: string)
  {
    if (formDiv == 'div1') {
      this.div1 = true;
      this.div2 = false;
      this.div3 = false;
    }
    else if (formDiv == 'div2')
    {
      this.div1 = false;
      this.div2 = true;
      this.div3 = false;
    }
    else if (formDiv == 'div3')
    {
      this.div1 = false;
      this.div2 = false;
      this.div3 = true;
    }
  }

  hideAllDivs()
  {
    this.div1 = false;
    this.div2 = false;
    this.div3 = false;
  }

  saveToLocalStorage() {
    // Save the filmReview object in tempSave as JSON
    let tempSave = JSON.stringify(this.filmReview);

    //Store the tempSave on the localStorage
    localStorage.setItem('session', tempSave)

    // transform the data from the Local Storage back to object type and store it in "data"
    let data: any = localStorage.getItem('session');

    //take the object array from "data" and store it in "localStorageFilmReview" to be used by the table
    this.localStorageFilmReview = JSON.parse(data);
  }
}
