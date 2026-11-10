import AsyncStorage from '@react-native-async-storage/async-storage';
import * as api from '../api/theMealDbApi';
import { createMealsService } from './mealsServiceCore';

const mealsService = createMealsService(api, AsyncStorage);

export const { fetchList, fetchDetail, fetchFavoriteMeal, fetchByCategory } = mealsService;
