document.addEventListener ("DOMContentLoaded", ()=> {



const initPopUp = () => {

	const popUp = document.querySelector('.pop-up');
	const popUpSliderContainer = document.querySelector('.pop-up__container-slider');
	const lengthImgPopUp = document.querySelector('.length-img-pop-up');
	const indexImgPopUp = document.querySelector('.index-img-pop-up');
	const allImg = document.querySelectorAll('.img');
	const btnPrev = document.querySelector('.prev-img');
	const btnNext = document.querySelector('.next-img');
	const btnClose = document.querySelector('.pop-up__close');

	let indexImg = saveIndex();
	let isAnimating = false;


	allImg.forEach((element, index, allElem) => {
		element.addEventListener('click', () => {
			showPopUp(index, allElem, popUpSliderContainer, popUp);
			showLengthImgPopUp(lengthImgPopUp, allImg.length);
			showIndexImgPopUp(indexImgPopUp, index);
			document.body.style.overflow = 'hidden';
		});
	});
	btnClose.addEventListener('click', () => {
		removePopUpImg(popUpSliderContainer);
		closePopUp(popUp);
		document.body.style.overflow = 'auto';
	});


	btnPrev.addEventListener('click', () => {
		if (!isAnimating) {
			toggleOpacity(popUpSliderContainer);
			isAnimating = true;

			setTimeout(() => {
				showImg('prev');
				toggleOpacity(popUpSliderContainer);
				removeFirstChildIfMultipleChildren(popUpSliderContainer, 'firstElementChild');
				isAnimating = false;
			}, 500);
		}
	});
	btnNext.addEventListener('click', () => {
		if (!isAnimating) {
			isAnimating = true;
			toggleOpacity(popUpSliderContainer);
			setTimeout(() => {
				showImg('next');
				toggleOpacity(popUpSliderContainer);
				removeFirstChildIfMultipleChildren(popUpSliderContainer, 'firstElementChild');
				isAnimating = false;
			}, 500);
		}
	});

	const screenWidth = document.documentElement.clientWidth;
	const screenCenter = screenWidth / 2;
	let isDragging = false;
	let startX;
	let elementCoordinates;

	popUp.addEventListener('pointerdown', (e) => {
		if (e.target.classList.contains('pop-up-img')) {
			e.preventDefault();
			removeClass(e.target, 'pop-up-left-center');
			removeClass(e.target, 'pop-up-right-center');
			isDragging = true;
			startX = e.clientX - e.target.getBoundingClientRect().left;
		}
	});
	document.addEventListener('pointermove', (e) => {

		if (!isDragging) return;
		e.preventDefault();
		document.body.style.overflow = 'hidden';
		setValueProperty(e.target, 'left', 'initial');
		setValueProperty(e.target, '--x', `${e.clientX - startX}px`)
		elementCoordinates = e.clientX - startX;
	});
	document.addEventListener('pointerup', (e) => {
		isDragging = false;
		if (!e.target.classList.contains('pop-up-img')) return;
		const elemCenter = e.target.offsetWidth / 2;

		if (elementCoordinates + elemCenter < screenCenter) {
			animateAndShow(e.target, 'prev', '-10vw', 'pop-up-right-center');
		} else {
			animateAndShow(e.target, 'next', '105vw', 'pop-up-left-center');
		}
	});


	function animateAndShow(elem, direction, distance, className) {
		setValueProperty(elem, '--x', distance, 'animation');
		setTimeout(() => {
			showImg(direction, className);
			removeFirstChildIfMultipleChildren(popUpSliderContainer, 'firstElementChild');
		}, 200);
	}
	function setValueProperty(elem, property, distance, animation = false) {
		elem.style.setProperty(property, distance);
		if (animation) {
			elem.style.transition = 'all .3s ease';
		}
	}


	function showPopUp(index, allElem, containerContent, popUp) {
		const imgCopy = allElem[index].cloneNode('true');
		imgCopy.classList.add('pop-up-img');
		imgCopy.classList.remove('img');
		containerContent.append(imgCopy);
		popUp.classList.add('pop-up--active');
		indexImg.save(index);
		document.body.style.overflow = 'hidden'
	}
	function closePopUp(popUp) {
		popUp.classList.remove('pop-up--active');
		document.body.style.overflow = ''
	}


	function showImg(direction, animationClass = false) {
		if (animationClass) {
			countIndexElem(direction, indexImg.getSaveIndex(), allImg);
			addingImgInPopUp(popUpSliderContainer, allImg, indexImg.getSaveIndex(), animationClass, indexImgPopUp);
			return;
		}
		countIndexElem(direction, indexImg.getSaveIndex(), allImg);
		addingImgInPopUp(popUpSliderContainer, allImg, indexImg.getSaveIndex(), false, indexImgPopUp);
	}
	function addingImgInPopUp(container, allElem, indexElem, animationClass = false, indexImgPopUp) {
		const clone = allElem[indexElem].cloneNode('true');
		const originalAlt = allElem[indexElem].getAttribute('alt');

		clone.classList.remove('img');
		clone.removeAttribute('alt');

		if (originalAlt) {
			clone.setAttribute('alt', originalAlt);
		}

		if (!animationClass) {
			clone.classList.add('pop-up-img');
			container.append(clone);
			showIndexImgPopUp(indexImgPopUp, indexElem);
			return;
		}

		container.append(clone);
		clone.classList.add(animationClass);

		setTimeout(() => {
			clone.classList.add('pop-up-img');

			showIndexImgPopUp(indexImgPopUp, indexElem);

		}, 500);
	}

	function saveIndex() {
		let imgIndex = 0;
		function save(index) {
			imgIndex = index;
		}
		function getSavedIndex() {
			return imgIndex;
		}
		return {
			save: save,
			getSaveIndex: getSavedIndex
		}
	}
	function countIndexElem(direction, index, allElem) {
		if (direction === 'next') {
			if ((allElem.length - 1) === index) {
				index = -1;
			}
			index += 1;
			indexImg.save(index);
			return;
		} else if (direction === 'prev') {
			if (0 === index) {
				index = allElem.length - 1;
			} else {
				index -= 1;
			}
			indexImg.save(index);
		}
	}


	function removePopUpImg(content) {
		content.innerHTML = '';
	}
	function removeFirstChildIfMultipleChildren(allElemPopUp, child) {
		if (allElemPopUp.children.length > 1) {
			allElemPopUp[child].remove();
		}
	}
	function removeClass(elem, className) {
		elem.classList.remove(className);
	}
	function toggleOpacity(elem) {
		elem.classList.toggle('transparent');
	}


	function showLengthImgPopUp(container, length) {
		container.textContent = '/ ' + length;
	}
	function showIndexImgPopUp(container, index) {
		container.textContent = index + 1;
	}


	const fullscreenButton = document.querySelector('.pop-up__fullscreen');
	fullscreenButton.addEventListener('click', toggleFullScreen);

	function toggleFullScreen() {
		if (!document.fullscreenElement) {
			document.documentElement.requestFullscreen();
		} else {
			document.exitFullscreen();
		}
	}
}
initPopUp();


const sliderReviews = () => {
	const btnNext = document.querySelector('.next-btn-arrow');
	const btnPrev = document.querySelector('.prev-btn-arrow');
	const containerSlider = document.querySelector('.container-slider');
	const slider = document.querySelector('.slider');
	const allSlide = document.querySelectorAll('.paragraph-reviews');
	const sliderLength = document.querySelectorAll('.item').length;
	const currentPosition = {
		position: 0,
		getPosition() {
			return this.position;
		},
		setPosition(value) {
			this.position = value;
		},
		movePosition(value) {
			this.position += value;
		},
	};
	const mediaQueries = {
		1: window.matchMedia('(max-width: 1024px)'),
		2: window.matchMedia('(min-width: 1025px)')
	};
	const objSlider = {
		distance: updateWidthItem(),
		position: currentPosition,
		visibleSlides: getVisibleSlidesMediaQueries(mediaQueries),
		containerSlider: containerSlider,
		slider: slider,
		countStep: null,
		sliderLength: sliderLength,
		setCountTotalStep() {
			this.countStep = this.sliderLength - this.visibleSlides + 1;
		}
	};


	document.addEventListener('DOMContentLoaded', () => {
		objSlider.setCountTotalStep();
		btnPrev.setAttribute('disabled', 'true');
	});
	window.addEventListener('resize', () => {
		resetSlider(objSlider, animateSlider);
		objSlider.distance = updateWidthItem();
		objSlider.visibleSlides = getVisibleSlidesMediaQueries(mediaQueries);
		objSlider.setCountTotalStep();
		btnPrev.setAttribute('disabled', 'true');
	});

	btnPrev.addEventListener('click', function () {

		movePrev(objSlider, animateSlider);
	});
	btnNext.addEventListener('click', function () {

		moveNext(objSlider, animateSlider);
	});


	function getVisibleSlidesMediaQueries(media) {
		for (let key in media) {
			if (media[key].matches) {
				return parseInt(key);
			}
		}
	}
	function moveNext(objSlider, animateCallback) {
		btnPrev.removeAttribute('disabled');
		const { visibleSlides, position, slider, distance, sliderLength } = objSlider;
		const value = distance * sliderLength - visibleSlides * distance;
		position.movePosition(-distance);
		if (position.getPosition() === -value) {
			btnNext.setAttribute('disabled', 'true');
		}
		animateCallback(slider, position.getPosition());
	}

	function movePrev(objSlider, animateCallback) {
		btnNext.removeAttribute('disabled');
		const { position, slider, distance } = objSlider;
		position.movePosition(distance);
		if (position.getPosition() === 0) {
			btnPrev.setAttribute('disabled', 'true');
		}
		animateCallback(slider, position.getPosition());
	}


	function resetSlider(objSlider, animationFunction) {
		const { slider, position } = objSlider;
		position.movePosition(-position.getPosition());
		animationFunction(slider, position.getPosition());
	}
	function updateSliderPosition(elem, value) {
		elem.style.transform = `translateX(${value}px)`;
	}
	function animateSlider(elem, value) {
		requestAnimationFrame(() => {
			updateSliderPosition(elem, value);
		})
	}
	function updateWidthItem() {
		let widthItem = document.querySelector('.item').offsetWidth;
		return widthItem;
	}


	let isDragging = false;
	let startX;
	let offsetLeft = slider.getBoundingClientRect().left;
	let move;
	let dataDirectionPage = null;
	let dataStartPage;


	slider.addEventListener('pointerdown', (e) => {
		e.preventDefault();
		isDragging = true;

		startX = e.clientX - slider.getBoundingClientRect().left;
		dataStartPage = e.pageX;;


		const scrollbarWidth = window.innerWidth - document.body.clientWidth;
		document.body.style.overflow = 'hidden'
		document.body.style.paddingRight = `${scrollbarWidth}px`;
	}, { passive: false });



	slider.addEventListener('pointermove', (e) => {
		if (!isDragging) return;
		e.preventDefault();


		move = (e.clientX - startX - offsetLeft);
		slider.style.transition = 'transform .3s linear';
		dataDirectionPage = e.pageX;
		animateSlider(slider, move);

	}, { passive: false });

	document.addEventListener('pointerup', () => {
		if (!isDragging) return;
		isDragging = false;

		document.body.style.paddingRight = '';
		document.body.style.overflow = '';


		slider.style.transition = 'transform .3s';
		const sliderEnd = -(objSlider.sliderLength * objSlider.distance - (objSlider.visibleSlides * objSlider.distance));

		if (objSlider.position.getPosition() + (dataDirectionPage - dataStartPage) > 0) {
			currentPosition.setPosition(0);
			setTimeout(() => {
				slider.style.transform = `translateX(${currentPosition.getPosition()}px)`;
			}, 50);
			return;
		}
		if (objSlider.position.getPosition() + (dataDirectionPage - dataStartPage) < sliderEnd) {
			currentPosition.setPosition(sliderEnd);
			setTimeout(() => {
				slider.style.transform = `translateX(${sliderEnd}px)`;
			}, 50);
			return;
		}

		if (dataDirectionPage - dataStartPage < -20 && dataDirectionPage !== null) {
			moveNext(objSlider, animateSlider);
		}
		if (dataDirectionPage - dataStartPage > 20 && dataDirectionPage !== null) {
			movePrev(objSlider, animateSlider);
		}
		dataDirectionPage = null;
		dataStartPage = null;
	});

}
sliderReviews();


const initForm = () => {

		const form = document.querySelector('.shipping-calculator');
		form.addEventListener('submit', handleSubmit);

	function validateEmail(input) {
		const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		return regex.test(input.value);
	}

	function handleSubmit(e) {
		e.preventDefault();
		const form = document.querySelector('.shipping-calculator');
		if (validateForm()) {
			alert('Форма отправлена успешно!');
		} else {
			form.addEventListener('input', ValidationEventInput);
			alert('Пожалуйста, заполните все поля корректно.');
		}
	}
	
	function validateForm() {
		const emailInput = document.querySelector('.shipping-calculator__email');
		const nameInput = document.querySelector('.shipping-calculator__name');
		const phoneInput = document.querySelector('.shipping-calculator__phone');
		const areaInput = document.querySelector('.shipping-calculator__area');
		const weightInput = document.querySelector('.shipping-calculator__weight');
		const locationInputs = document.querySelectorAll('.location');

		let isValid = true;



		if (!validateEmail(emailInput)) {
			toggleValidationVisibility(emailInput, !validateEmail(emailInput))
			isValid = false;
		}


		if (inputLengthValidator(nameInput, 3, 15)) {
			toggleValidationVisibility(nameInput, true);
			isValid = false;
		}
		if (isEmptyInput(phoneInput)) {
			console.log('isEmptyInput(phoneInput)');
			toggleValidationVisibility(phoneInput, true);
			isValid = false;
		}

		if (isEmptyInput(weightInput)) {
			toggleValidationVisibility(weightInput, true);
			isValid = false;
		}
		if (isEmptyInput(areaInput)) {
			toggleValidationVisibility(areaInput, true);
			isValid = false;
		}
		locationInputs.forEach(input => {
			if (inputLengthValidator(input, 3, 15)) {
				toggleValidationVisibility(input, true);
				isValid = false;
			}
		});
		return isValid;
	}

	function ValidationEventInput(e) {
		let input = e.target;
		if (input.classList.contains('shipping-calculator__email')) {
			toggleValidationVisibility(input, !validateEmail(input))
		}
		if (input.classList.contains('shipping-calculator__name')) {
			toggleValidationVisibility(input, inputLengthValidator(input, 3, 15))
		}
		if (input.classList.contains('shipping-calculator__phone')) {
			toggleValidationVisibility(input, inputContainsSymbol(input, '_')
			)
		}
		if (input.matches('.shipping-calculator__area, .shipping-calculator__weight')) {
			toggleValidationVisibility(input, isEmptyInput(input));
		}
		if (input.classList.contains('location')) {
			toggleValidationVisibility(input, inputLengthValidator(input, 3))
		}
	}

	function inputLengthValidator(input, min = 0, max = Infinity) {
		const isNotValid = input.value.trim().length > max || input.value.trim().length < min;

		return isNotValid;
	}

	function inputContainsSymbol(input, value) {
		const isValuePresent = input.value.indexOf(value) !== -1;
		return isValuePresent;
	}

	function isEmptyInput(input) {
		const isNotValid = input.value.trim() === '';

		return isNotValid;
	}

	function toggleValidationVisibility(input, isNotValid) {
		input.nextElementSibling.style.visibility = isNotValid ? 'visible' : 'hidden';
	}
}

initForm();


const initBurgerMenu = () => {
	const burgerMenu = document.querySelector('.burger-menu');

	const burgerMenuActive = () => {
		const line_1 = document.querySelector('.burger-menu__line-1');
		const line_2 = document.querySelector('.burger-menu__line-2');
		const line_3 = document.querySelector('.burger-menu__line-3');
		const burgerMenu = document.querySelector('.burger-menu');
		let active = false;
		burgerMenu.addEventListener('click', () => {
			line_1.classList.toggle('rotate-line-1');
			line_2.classList.toggle('display-none');
			line_3.classList.toggle('rotate-line-3');
			active = !active;

		})
		return () => active;
	}

	
	const getActiveState = burgerMenuActive();

	burgerMenu.addEventListener('click', () => {
		const headerFooter = document.querySelector('.header__footer');
		const headerTextInfo = document.querySelector('.container-header__text-info');
		if (getActiveState) {
			headerTextInfo.classList.toggle('hidden-menu');
			headerFooter.classList.toggle('hidden-menu');
		}
	});
}
initBurgerMenu();

const phoneNumberMask = (positionStart, mask, arrSymbols, selector, hover = false) => {
	const input = document.querySelector(selector);
	const lengthMask = mask.length;
	const numberPlaceholderArr = mask.split('');
	let valueArrMask = mask.split('');
	let valueUser = '';
	let indexValue = positionStart;
	let cursorPosition = positionStart;
	let inputFocus = false;


	input.addEventListener('focus', (e) => {
		inputFocus = true;
		if (!valueUser.length) {
			e.target.value = mask;
			setCursorPosition(input, positionStart)
		}
	})
	input.addEventListener('blur', (e) => {
		inputFocus = false;
		if (!valueUser.length) {
			e.target.value = '';
		}
	})
	input.addEventListener('keydown', (e) => {
		e.preventDefault()
		const key = e.key;
		if (key === 'Tab') return;
		if (key === 'Delete' && cursorPosition < indexValue) {
			if (cursorPosition < positionStart) {
				cursorPosition = positionStart;
				setCursorPosition(e.target, cursorPosition);
				return;
			}
			if (arrSymbols.includes(valueArrMask[indexValue - 1]) || valueArrMask[indexValue - 1] === ' ') {
				indexValue = decrementIndexValue(indexValue);
			}

			indexValue = decrementIndexValue(indexValue);
			valueArrMask = deleteNumberPhone(valueArrMask, indexValue, numberPlaceholderArr);
			valueUser = deleteLastCharacter(valueUser);
			e.target.value = valueArrMask.join('');
			setCursorPosition(e.target, cursorPosition);
			return;
		}



		if (key === 'ArrowRight') {
			cursorPosition < lengthMask && cursorPosition++;
			setCursorPosition(e.target, cursorPosition);
		} if (key === 'ArrowLeft') {
			cursorPosition > 0 && cursorPosition--;
			setCursorPosition(e.target, cursorPosition);
		}

		if (key === 'Backspace' && indexValue > positionStart) {

			if (arrSymbols.includes(valueArrMask[indexValue - 1]) || valueArrMask[indexValue - 1] === ' ') {
				indexValue = decrementIndexValue(indexValue);
				indexValue = decrementIndexValue(indexValue);
				valueArrMask = backspaceNumberPhone(valueArrMask, indexValue, numberPlaceholderArr);
				cursorPosition = indexValue;
				setTimeout(() => {
					e.target.value = valueArrMask.join('');
					setCursorPosition(e.target, cursorPosition);
				}, 0);


				valueUser = deleteLastCharacter(valueUser);
				return;
			}
			indexValue = decrementIndexValue(indexValue);
			cursorPosition = indexValue;
			valueArrMask = backspaceNumberPhone(valueArrMask, indexValue, numberPlaceholderArr);
			valueUser = deleteLastCharacter(valueUser, numberPlaceholderArr);
			e.target.value = valueArrMask.join('');
			setCursorPosition(e.target, cursorPosition);
			return;
		}

		if (indexValue === lengthMask) {
			return;
		}
		if (e.code === 'Backspace' && e.target.selectionStart < positionStart) {
			e.preventDefault();
			setCursorPosition(e.target, positionStart)
		}
		if (key >= '0' && key <= '9') {
			if (arrSymbols.includes(valueArrMask[indexValue]) || valueArrMask[indexValue] === ' ') {
				indexValue = incrementIndex(indexValue);
			}
			valueUser += e.key;
			valueArrMask[indexValue] = e.key;
			indexValue = incrementIndex(indexValue);
			cursorPosition = indexValue;
			e.target.value = valueArrMask.join('');
			setCursorPosition(e.target, cursorPosition);
		}
	});

	input.addEventListener('click', (e) => {
		if (e.target.selectionStart < positionStart || !valueUser) {
			setCursorPosition(e.target, positionStart);
			cursorPosition = e.target.selectionStart;
			return
		}
		cursorPosition = e.target.selectionStart;
	})


	if (hover) {
		input.addEventListener('mouseenter', (e) => {
			if (!valueUser.length) {
				e.target.value = mask;
			}
		});
		input.addEventListener('mouseleave', (e) => {
			if (!valueUser.length && !inputFocus) {
				e.target.value = '';
			}
		});
	}

	function backspaceNumberPhone(arr, cursorPosition, numberPlaceholderArr) {
		let maskArr = arr;
		let arrUserData = maskArr.map((v, i, arr) => {
			if (i === cursorPosition) {
				arr[i] = numberPlaceholderArr[i];
				return arr[i];
			}
			return v;
		})
		return arrUserData;
	}
	function deleteNumberPhone(arr, cursorPosition, numberPlaceholderArr) {
		let maskArr = arr;
		let arrUserData = maskArr.map((v, i, arr) => {
			if (i >= cursorPosition && arr[i] !== ' ' && !arrSymbols.includes(arr[i])) {
				return arr[i] = numberPlaceholderArr[i];;
			}
			return v;
		})
		return arrUserData;
	}
	function setCursorPosition(inputElement, cursorPosition) {
		inputElement.selectionStart = inputElement.selectionEnd = cursorPosition;
	}
	function decrementIndexValue(index) {
		return index - 1;
	}
	function incrementIndex(index) {
		return index + 1;
	}
	function deleteLastCharacter(str) {
		return str.slice(0, -1);
	}
}

phoneNumberMask(3, '+7(___)___-__-__', [')', '(', '-'], '.shipping-calculator__phone', true);

//phoneNumberMask(стартовая позиция курсора,, маска,  массив не заменяемых символов, класс input к которому применяется маска,булево значение эффекта hover маски)


});
