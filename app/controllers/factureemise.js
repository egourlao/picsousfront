angular.module('picsousApp').controller('FactureEmiseCtrl', function($http, $routeParams, message, APP_URL, $scope, NgTableParams, loadingSpin) {
	loadingSpin.start();
	$http({
		method: 'GET',
		url: APP_URL + '/factureEmises/' + $routeParams.id,
	}).then(function(response) {
		$scope.facture = response.data;
		loadingSpin.end();
	}, function() {
		loadingSpin.end();
	});

	$scope.app_url = APP_URL;

	$scope.state = function(state) {
		if (state === 'D') return 'Dûe';
		if (state === 'T') return 'Partiellement payée';
		if (state === 'A') return 'Annulée';
		if (state === 'P') return 'Payée';
		return state;
	};

	$scope.modifyFacture = function() {
		$scope.oldFacture = angular.copy($scope.facture);
		$scope.modifyingFacture = true;
	};

	$scope.deleteEl = function(element, index) {
		if (!confirm('Voulez-vous vraiment supprimer l\'élement ' + element.nom + ' ?')) {
			return;
		}
		$http({
			method: 'DELETE',
			url: APP_URL + '/factureEmiseRows/' + element.id + '/',
		}).then(function() {
			message.success('Élément ' + element.nom + ' supprimé !');
			$scope.facture.factureemiserow_set.splice(index, 1);
		})
	};

	$scope.saveNewElement = function() {
		$scope.newElement.facture = $routeParams.id;
		$http({
			method: 'POST',
			url: APP_URL + '/factureEmiseRows/',
			data: $scope.newElement,
		}).then(function(response) {
			$scope.facture.factureemiserow_set.push(response.data);
			$scope.newFacture = {};
			$scope.addingElement = false;
		});
	};

	$scope.saveFacture = function() {
		$http({
			method: 'PUT',
			url: APP_URL + '/factureEmises/' + $routeParams.id + '/',
			data: $scope.facture,
		}).then(function(response) {
			$scope.facture = response.data;
			$scope.modifyingFacture = false;
			message.success('Facture modifiée !');
		})
	}

	$scope.cancelModifyingFacture = function() {
		$scope.facture = angular.copy($scope.oldFacture);
		$scope.modifyingFacture = false;
	}

	$scope.stateLabel = function(state) {
		if (state === 'D') return 'label-danger';
		if (state === 'T') return 'label-warning';
		if (state === 'A') return 'label-default';
		if (state === 'P') return 'label-primary';
		return 'label-default';
	};

	$scope.modifyElement = function(el) {
		el.old = angular.copy(el);
		el.modifying = true;
	};

	$scope.stopModifyingElement = function(el) {
		angular.extend(el, el.old);
		el.modifying = false;
	};

	$scope.saveElement = function(el) {
		var data = angular.copy(el);
		delete data.modifying;
		delete data.old;
		$http({
			method: 'PUT',
			url: APP_URL + '/factureEmiseRows/' + el.id + '/',
			data: data,
		}).then(function(response) {
			el.modifying = false;
			message.success('Élément modifié !');
		});
	};
});
