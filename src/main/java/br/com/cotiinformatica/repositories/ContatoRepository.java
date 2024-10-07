package br.com.cotiinformatica.repositories;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import br.com.cotiinformatica.entities.Contato;
import br.com.cotiinformatica.factories.ConnectionFactory;

public class ContatoRepository {

	public void create(Contato contado) throws Exception {

		var connection = ConnectionFactory.getConnection();
		var statement = connection
				.prepareStatement("INSERT INTO contato(id, nome, email, telefone) VALUES(?,?,?,?)");
		statement.setObject(1, contado.getId());
		statement.setString(2, contado.getNome());
		statement.setString(3, contado.getEmail());
		statement.setString(4, contado.getTelefone());
		statement.execute();

		connection.close();
	}

	public void update(Contato contado) throws Exception {

		var connection = ConnectionFactory.getConnection();
		var statement = connection
				.prepareStatement("UPDATE contato SET nome=?, email=?, telefone=? WHERE id=? ");
		statement.setString(1, contado.getNome());
		statement.setString(2, contado.getEmail());
		statement.setString(3, contado.getTelefone());
		statement.setObject(4, contado.getId());
		statement.execute();

		connection.close();
	}

	public void delete(Contato contato) throws Exception {
		var connection = ConnectionFactory.getConnection();
		var statement = connection.prepareStatement("DELETE FROM contato WHERE id=?");
		statement.setObject(1, contato.getId());
		statement.execute();

		connection.close();

	}

	public List<Contato> getAll() throws Exception {

		var connection = ConnectionFactory.getConnection();
		var statement = connection
				.prepareStatement("SELECT id, nome, email, telefone FROM contato ORDER BY nome");

		var resultSet = statement.executeQuery();

		var lista = new ArrayList<Contato>();

		while (resultSet.next()) {

			var contato = new Contato();

			contato.setId(UUID.fromString(resultSet.getString("id")));
			contato.setNome(resultSet.getString("nome"));
			contato.setTelefone(resultSet.getString("telefone"));
			contato.setEmail(resultSet.getString("email"));

			lista.add(contato);
		}

		connection.close();

		return lista;
	}

	public Contato getByid(UUID id) throws Exception {

		var connection = ConnectionFactory.getConnection();

		var statement = connection.prepareStatement("SELECT id, nome, telefone, email FROM contato WHERE id=?");
		statement.setObject(1, id);
		
		var resultSet = statement.executeQuery();

		Contato contato = null;

		if (resultSet.next()) {

			contato = new Contato();

			contato.setId(UUID.fromString(resultSet.getString("id")));
			contato.setNome(resultSet.getString("nome"));
			contato.setTelefone(resultSet.getString("telefone"));
			contato.setEmail(resultSet.getString("email"));

		}

		connection.close();

		return contato;

	}

}
