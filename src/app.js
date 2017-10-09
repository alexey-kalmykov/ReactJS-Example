const Router = ReactRouterDOM.BrowserRouter;
const Route = ReactRouterDOM.Route;
const Switch = ReactRouterDOM.Switch;
const Link = ReactRouterDOM.Link;

const ListGroup = ReactBootstrap.ListGroup;
const ListGroupItem = ReactBootstrap.ListGroupItem;
const Media = ReactBootstrap.Media;

// Список отделов
const ListDepartments = () => {
  let departments = [];
  for (let key in localStorage) {
    if (key.substring(0,1) == 'd') departments.push({
      id: key,
      num: key.substr(1),
      txt: localStorage.getItem(key)
    })
  }
  const content = departments.map((dep) =>
    <ListGroupItem key={dep.id} href={'/departments/'+dep.num+'/employees'}>
      {dep.txt}
    </ListGroupItem>
  )
  return (
    <ListGroup>
      <ListGroupItem bsStyle="info" header="Список всех отделов организации">
        Всего: {departments.length}
      </ListGroupItem>
      {content}
    </ListGroup>
  )
}
// Список сотрудников
const ListEmployees = (props) => {
  const id = props.match.params.num;
  let employees = [];
  for (let key in localStorage) {
    if (key.substring(0,1) == 'e') {
      let value = localStorage.getItem(key).split('&');
      if (value[0] == id) employees.push({
       id: key,
       num: key.substr(1),
       name: value[2]
      })
    }
  }
  const content = employees.map((emp) =>
      <ListGroupItem key={emp.id} href={'/employees/'+emp.num}>
        {emp.name}
      </ListGroupItem>
  )
  return (
    <ListGroup>
      <ListGroupItem bsStyle="info" header={localStorage.getItem('d' + id)}>
        Всего: {employees.length}
      </ListGroupItem>
      {content}
    </ListGroup>
  )
}
// Страница одного сотрудника
const Employee = (props) => {
  const id = props.match.params.num;
  const value = localStorage.getItem('e' + id).split('&');
  const num = localStorage.getItem('n' + id);
  const img = localStorage.getItem('p' + num);
  return (
    <Media>
      <Media.Left align="top">
        <label htmlFor="files">
          <img width={48} height={48} id="empimg" src={img} alt={value[2]}/>
        </label>
        <input type="file" id="files" name={id} onChange={PhotoChange}/>
      </Media.Left>
      <Media.Body>
        <Media.Heading>{value[2]}</Media.Heading>
        <p>{value[1]}</p>
      </Media.Body>
    </Media>
  )
}
// Изменение фото и запись в localStorage
const PhotoChange = (evt) => {
  let id = evt.target.name;
  let file = evt.target.files[0];
  if (file.type.match('image.*')) {
    let reader = new FileReader();
    reader.onload = (function(theFile) {
      return function(e) {
        let newimg = e.target.result;
        document.getElementById('empimg').src = newimg;
        localStorage.setItem('n'+id, id);
        localStorage.setItem('p'+id, newimg);
      };
    })(file);
    reader.readAsDataURL(file);
  }
}
// Отображение роутера когда готов localStorage
const ShowDIV = () => {
  ReactDOM.render(
    <Router>
        <Switch>
            <Route exact path="/departments" component={ListDepartments}/>}/>
            <Route path="/departments/:num/employees" component={ListEmployees}/>
            <Route path="/employees/:num" component={Employee}/>
            <Route children={()=><Link to={'departments'}>Список отделов</Link>}/>
        </Switch>
    </Router>,
    document.getElementById("root")
  )
}
// Загрузка данных из JSON и сохранение в localStorage
function LoadJSON() {
  let XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
  let xhr = new XHR();
  xhr.open('GET', 'http://camapa-kc.ru/data.json', true);
  xhr.onload = function() {
    let jd=JSON.parse(this.responseText);
    for (let key in jd.employees) {
      localStorage.setItem('e'+jd.employees[key].id, jd.employees[key].department+'&'+jd.employees[key].phone+'&'+jd.employees[key].name);
      localStorage.setItem('n'+jd.employees[key].id, jd.employees[key].photo);
    }
    for (let key in jd.departments) {
      localStorage.setItem('d'+jd.departments[key].id, jd.departments[key].name);
    }
    for (let key in jd.photos) {
      localStorage.setItem('p'+jd.photos[key].id, jd.photos[key].data);
    }
    ShowDIV();
  }
    xhr.send();
}
// Если есть localStorage сразу отображем, если нет сначала загружаем данные
if (localStorage.length) ShowDIV();
else LoadJSON();
