import './sass/style.scss';
//import { compareAsc, format } from 'date-fns';
import {todoController} from './js/controller';
import {todoModel} from './js/model';
import {todoView} from './js/view';

todoController.createProject(todoModel.init());