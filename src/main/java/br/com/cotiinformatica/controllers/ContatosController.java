package br.com.cotiinformatica.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.cotiinformatica.dtos.ContatoRequestDto;
import br.com.cotiinformatica.entities.Contato;
import br.com.cotiinformatica.repositories.ContatoRepository;

@RestController
@RequestMapping("/api/contatos")
public class ContatosController {

	
	@PostMapping
	public String post(@RequestBody ContatoRequestDto request) throws  Exception {
		
		var contato = new Contato();
		
		contato.setId(UUID.randomUUID());
		contato.setNome(request.getNome());
		contato.setEmail(request.getEmail());
		contato.setTelefone(request.getTelefone());
		
		var contatoRepository = new ContatoRepository();
		contatoRepository.create(contato);
		
		return "Contato cadastrado com sucesso.";
	}
	
	@PutMapping("{id}")
	public String put(@PathVariable UUID id, @RequestBody ContatoRequestDto request) throws  Exception {
		
		var contatoRepository = new ContatoRepository();
		var contato = contatoRepository.getByid(id);
		
		if(contato != null) {
			
			contato.setNome(request.getNome());
			contato.setEmail(request.getEmail());
			contato.setTelefone(request.getTelefone());
			
			contatoRepository.update(contato);
			
			return "Contato atualizado com sucesso.";
		}else {
			
			return "Contato não encontrado. Verifique o id informado";
		}
	}
	
	@DeleteMapping("{id}")
	public String delete(@PathVariable UUID id) throws  Exception {
		
		var contatoRepository = new ContatoRepository();
		var contato = contatoRepository.getByid(id);
		
		if(contato != null) {
			
			contatoRepository.delete(contato);
			
			return "Contato deletado com sucesso.";
		}else {
			
			return "Contato não encontrado. Verifique o id informado";
		}
	}
	@GetMapping 
	public List<Contato> get() throws Exception {

		var contatoRepository = new ContatoRepository();
		return contatoRepository.getAll();
	}
<<<<<<< HEAD
	
	@GetMapping("{id}")
	public Contato getById(UUID id) throws Exception {

=======
	@GetMapping("{id}")
	public Contato getById(@PathVariable UUID id)throws Exception{
		
>>>>>>> af44955f25553236aa38f09ae0893db57d9f6488
		var contatoRepository = new ContatoRepository();
		return contatoRepository.getByid(id);
	}
}
